﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.18033
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Bifrost {
    using System;
    using System.Reflection;


    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "4.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class ExceptionStrings {

        private static global::System.Resources.ResourceManager resourceMan;

        private static global::System.Globalization.CultureInfo resourceCulture;

        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal ExceptionStrings() {
        }

        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("Bifrost.ExceptionStrings", typeof(ExceptionStrings).GetTypeInfo().Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }

        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Multiple implementations of ICanCreateContainer was found.
        /// </summary>
        public static string AmbiguousContainerCreationException {
            get {
                return ResourceManager.GetString("AmbiguousContainerCreationException", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Couldn&apos;t discover an implementation of &quot;ICanCreateContainer&quot;.
        /// </summary>
        public static string CanCreateContainerNotFoundException {
            get {
                return ResourceManager.GetString("CanCreateContainerNotFoundException", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to You cannot fast forward an event source that is not the initial version..
        /// </summary>
        public static string CannotFastForwardEventSourceThatIsNotInitialVersion {
            get {
                return ResourceManager.GetString("CannotFastForwardEventSourceThatIsNotInitialVersion", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to You cannot fast forward a stateful event source.  You need to replay events to restore state..
        /// </summary>
        public static string CannotFastForwardStatefulEventSource {
            get {
                return ResourceManager.GetString("CannotFastForwardStatefulEventSource", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Command has not been established.
        /// </summary>
        public static string CommandNotEstablished {
            get {
                return ResourceManager.GetString("CommandNotEstablished", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Type &apos;{0}&apos; is missing a default constructor and one is required.
        /// </summary>
        public static string MissingDefaultConstructorException {
            get {
                return ResourceManager.GetString("MissingDefaultConstructorException", resourceCulture);
            }
        }

        /// <summary>
        ///   Looks up a localized string similar to Command of type &apos;{0}&apos; was not handled.
        /// </summary>
        public static string UnhandledCommandException {
            get {
                return ResourceManager.GetString("UnhandledCommandException", resourceCulture);
            }
        }
    }
}
