#region License
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
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using Bifrost.Concepts;
using Bifrost.Extensions;
using Bifrost.Serialization;

namespace Bifrost.Web.Services
{
    public class RestServiceMethodInvoker : IRestServiceMethodInvoker
    {
        readonly ISerializer _serializer;
        readonly IJsonInterceptor _jsonInterceptor;

        public RestServiceMethodInvoker(ISerializer serializer, IJsonInterceptor jsonInterceptor)
        {
            _serializer = serializer;
            _jsonInterceptor = jsonInterceptor;
        }

        public string Invoke(string baseUrl, object instance, Uri uri, IDictionary<string, string> inputParameters)
        {
            FilterInputParameters(inputParameters);

            var type = instance.GetType();
            var methodName = GetMethodNameFromUri(uri);
            ThrowIfMethodNameNotSpecified(methodName, instance, uri);
            ThrowIfMethodMissing(methodName, instance, uri);

            var method = type.GetMethod(methodName);
            ThrowIfParameterCountMismatches(method, type, uri, inputParameters);
            ThrowIfParameterMissing(method, type, uri, inputParameters);

            var values = GetParameterValues(inputParameters, method);
            var result = method.Invoke(instance, values);

            var serializedResult = _serializer.ToJson(result, SerializationOptions.CamelCase);

            serializedResult = _jsonInterceptor.Intercept(serializedResult);

            return serializedResult;
        }

        static void FilterInputParameters(IDictionary<string, string> inputParameters)
        {
            inputParameters.Remove("_");
            inputParameters.Remove("_q");
            inputParameters.Remove("_rm");
            inputParameters.Remove("_cmd");
        }

        object[] GetParameterValues(IDictionary<string, string> inputParameters, MethodInfo method)
        {
            return method
                .GetParameters()
                .Select(p => new { Type = p.ParameterType, AsString = inputParameters[p.Name]})
                .Select(p => HandleValue(p.Type, p.AsString))
                .ToArray();
        }

        static string Unescape(string value)
        {
            return value.RemovePrefix("\"").RemovePostfix("\"");
        }

        object HandleValue(Type parameterType, string input)
        {
            if (parameterType == typeof(string))
            {
                return input;
            }

            input = Unescape(input);
            if (parameterType.IsValueType)
            {
                return TypeDescriptor.GetConverter(parameterType).ConvertFromInvariantString(input);
            }
            else if (parameterType.IsConcept())
            {
                return input.ParseTo(parameterType.GetConceptValueType());
            }

            input = _jsonInterceptor.Intercept(input);
            return _serializer.FromJson(parameterType, input);
        }

        static string GetMethodNameFromUri(Uri uri)
        {
            var segments = uri.AbsolutePath.RemovePrefix("/").Split('/');
            return segments.Length > 1 ? segments[segments.Length - 1] : string.Empty;
        }

        static void ThrowIfParameterMissing(
            MethodInfo methodInfo,
            Type type,
            Uri uri,
            IDictionary<string, string> inputParameters)
        {
            var missingParameter = methodInfo
                .GetParameters()
                .Select(p => p.Name)
                .FirstOrDefault(n => !inputParameters.ContainsKey(n));
            if (missingParameter != null)
            {
                throw new MissingParameterException(missingParameter, type.Name, uri);
            }
        }

        static void ThrowIfParameterCountMismatches(
            MethodInfo methodInfo,
            Type type,
            Uri uri,
            IDictionary<string, string> inputParameters)
        {
            var parameters = methodInfo.GetParameters();
            if (inputParameters.Count != parameters.Length)
            {
                throw new ParameterCountMismatchException(uri, type.Name, inputParameters.Count, parameters.Length);
            }
        }

        static void ThrowIfMethodNameNotSpecified(string methodName, object instance, Uri uri)
        {
            if (string.IsNullOrEmpty(methodName))
            {
                throw new MethodNotSpecifiedException(instance.GetType(), uri);
            }
        }

        static void ThrowIfMethodMissing(string methodName, object instance, Uri uri)
        {
            if (instance.GetType().GetMethod(methodName) == null)
            {
                throw new MissingMethodException($"Missing method '{methodName}' for Uri '{uri}'");
            }
        }
    }
}
