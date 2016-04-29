﻿#region License
//
// Copyright (c) 2008-2015, Dolittle (http://www.dolittle.com)
//
// Licensed under the MIT License (http://opensource.org/licenses/MIT)
//
// You may not use this file except in compliance with the License.
// You may obtain a copy of the license at
//
//   http://github.com/dolittle/Bifrost/blob/master/MIT-LICENSE.txt
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
#endregion
using System.Globalization;
using System.Reflection;
using System.Threading.Tasks;
using Bifrost.Bootstrap;
using Bifrost.Bootstrap.Defaults;
using Bifrost.Configuration.Defaults;
using Bifrost.Diagnostics;
using Bifrost.Execution;
using Bifrost.Extensions;

namespace Bifrost.Configuration
{
    /// <summary>
    /// Represents the default <see cref="IConfigure"/> type.
    /// </summary>
    [IgnoreDefaultConvention]
    public class Configure : IConfigure
    {
        static readonly object InstanceLock = new object();

        /// <summary>
        /// Gets the static instance of <see cref="Configure"/>
        /// </summary>
        public static Configure Instance { get; private set; }

        /// <summary>
        /// Gets the entry assembly for the application
        /// </summary>
        public static Assembly EntryAssembly => Instance.Container.Get<ICanCreateContainer>().GetType().Assembly;

        Configure(IContainer container)
        {
            SystemName = "[Not Set]";
            container.Bind<IConfigure>(this);
            Container = container;
            InitializeProperties();
        }

        /// <summary>
        /// Configure by letting Bifrost discover anything that implements the discoverable configuration interfaces.
        /// </summary>
        /// <remarks>
        /// The discoverable interfaces are found in <see cref="Bifrost.Conventions"/>.
        /// </remarks>
        /// <returns>Configuration object to continue configuration on.</returns>
        public static Configure DiscoverAndConfigure()
        {
            return DiscoverAndConfigure(new DefaultBootstrapConfiguration());
        }

        /// <summary>
        /// Configure by letting Bifrost discover anything that implements the discoverable configuration interfaces.
        /// </summary>
        /// <returns>Configuration object to continue configuration on.</returns>
        public static Configure DiscoverAndConfigure(IBootstrapConfiguration bootstrapConfiguration)
        {
            var bootstrapper = new Bootstrapper();
            var bootstrapContainer = bootstrapper.BootstrapTypes(bootstrapConfiguration);
            var container = bootstrapContainer.BootstrapContainer();

            bootstrapContainer.Get<IDefaultBindings>().Initialize(container);
            bootstrapContainer.Get<IDefaultConventions>().Initialize(container);

            var configure = With(container);
            configure.Initialize();
            return configure;
        }

        /// <summary>
        /// Configure with a specific <see cref="IContainer"/>.
        /// </summary>
        /// <param name="container"><see cref="IContainer"/> to configure with.</param>
        /// <returns>Configuration object to continue configuration on.</returns>
        public static Configure With(IContainer container)
        {
            if (Instance == null)
            {
                lock (InstanceLock)
                {
                    Instance = new Configure(container);
                }
            }

            return Instance;
        }

        /// <summary>
        /// Reset configuration
        /// </summary>
        public static void Reset()
        {
            lock (InstanceLock) Instance = null;
        }

#pragma warning disable 1591 // Xml Comments
        public IContainer Container { get; }
        public string SystemName { get; set; }
        public IDefaultStorageConfiguration DefaultStorage { get; set; }
        public ICommandsConfiguration Commands { get; private set; }
        public IEventsConfiguration Events { get; private set; }
        public ITasksConfiguration Tasks { get; private set; }
        public IViewsConfiguration Views { get; private set; }
        public IBindingConventionManager ConventionManager { get; private set; }
        public ISagasConfiguration Sagas { get; private set; }
        public ISerializationConfiguration Serialization { get; private set; }
        public IFrontendConfiguration Frontend { get; private set; }
        public ICallContextConfiguration CallContext { get; private set; }
        public IExecutionContextConfiguration ExecutionContext { get; private set; }
        public ISecurityConfiguration Security { get; private set; }
        public IQualityAssurance QualityAssurance { get; private set; }
        public CultureInfo Culture { get; set; }
        public CultureInfo UICulture { get; set; }

        public void Initialize()
        {
            ConfigureFromCanConfigurables();
            InitializeCulture();

            var initializers = new IConfigurationElement[] {
                Serialization,
                Commands,
                Events,
                Tasks,
                Views,
                Sagas,
                Frontend,
                CallContext,
                ExecutionContext,
                Security,
                DefaultStorage,
            };

            Parallel.ForEach(initializers, i => i.Initialize(Container));
            ConfigurationDone();
        }
#pragma warning restore 1591 // Xml Comments


        void InitializeProperties()
        {
            Commands = Container.Get<ICommandsConfiguration>();
            Events = Container.Get<IEventsConfiguration>();
            Tasks = Container.Get<ITasksConfiguration>();
            Views = Container.Get<IViewsConfiguration>();
            ConventionManager = Container.Get<IBindingConventionManager>();
            Sagas = Container.Get<ISagasConfiguration>();
            Serialization = Container.Get<ISerializationConfiguration>();
            DefaultStorage = Container.Get<IDefaultStorageConfiguration>();
            Frontend = Container.Get<IFrontendConfiguration>();
            CallContext = Container.Get<ICallContextConfiguration>();
            ExecutionContext = Container.Get<IExecutionContextConfiguration>();
            Security = Container.Get<ISecurityConfiguration>();
            QualityAssurance = Container.Get<IQualityAssurance>();
        }

        void InitializeCulture()
        {
            Culture = Culture ?? CultureInfo.InvariantCulture;
            UICulture = UICulture ?? CultureInfo.InvariantCulture;
        }

        void ConfigureFromCanConfigurables()
        {
            var callbacks = Container.Get<IInstancesOf<ICanConfigure>>();
            callbacks.ForEach(c => c.Configure(this));
        }

        void ConfigurationDone()
        {
            var callbacks = Container.Get<IInstancesOf<IWantToKnowWhenConfigurationIsDone>>();
            callbacks.ForEach(c => c.Configured(this));
        }
    }
}
