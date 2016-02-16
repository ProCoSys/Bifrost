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
using System.Net;
using Raven.Client.Document;

namespace Bifrost.RavenDB
{
    public class DocumentStoreConfiguration : IDocumentStoreConfiguration
    {
        public string Url { get; set; }
        public string DefaultDatabase { get; set; }
        public ICredentials Credentials { get; set; }

        public virtual DocumentStore CreateDocumentStore()
        {
            var documentStore = new DocumentStore
            {
                Url = Url
            };

            if (DefaultDatabase != null)
                documentStore.DefaultDatabase = DefaultDatabase;

            if (Credentials != null)
                documentStore.Credentials = Credentials;

            documentStore.Conventions.CustomizeJsonSerializer = s =>
            {
                s.Converters.Add(new MethodInfoConverter());
            };

            documentStore.Initialize();

            return documentStore;
        }

        public virtual void CopyTo(DocumentStoreConfiguration target)
        {
            target.Url = Url;
            target.DefaultDatabase = DefaultDatabase;
            target.Credentials = Credentials;
        }
    }
}
