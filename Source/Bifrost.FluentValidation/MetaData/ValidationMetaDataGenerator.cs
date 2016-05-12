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
using System.Linq;
using Bifrost.Concepts;
using Bifrost.Execution;
using Bifrost.Extensions;
using Bifrost.FluentValidation.Commands;
using Bifrost.Validation.MetaData;
using FluentValidation;
using FluentValidation.Validators;

namespace Bifrost.FluentValidation.MetaData
{
    /// <summary>
    /// Represents an implementation of <see cref="ICanGenerateValidationMetaData"/>
    /// </summary>
    public class ValidationMetaDataGenerator : ICanGenerateValidationMetaData
    {
        static readonly PropertyValidatorContext NullContext =
            new PropertyValidatorContext(new ValidationContext(null), null, null);

        readonly ICommandValidatorProvider _validatorProvider;
        readonly Dictionary<Type, ICanGenerateRule> _generatorsByType;

        /// <summary>
        /// Initializes a new instance of <see cref="ValidationMetaDataGenerator"/>
        /// </summary>
        /// <param name="ruleGenerators">The known instances of generators.</param>
        /// <param name="validatorProvider">The provider of command input validators.</param>
        public ValidationMetaDataGenerator(
            IInstancesOf<ICanGenerateRule> ruleGenerators,
            ICommandValidatorProvider validatorProvider)
        {
            _validatorProvider = validatorProvider;
            _generatorsByType = Generators(ruleGenerators);
        }

#pragma warning disable 1591 // Xml Comments

        public TypeMetaData GenerateFor(Type typeForValidation)
        {
            var metaData = new TypeMetaData();

            var validator = _validatorProvider.GetInputValidatorFor(typeForValidation);
            GenerateForValidator(validator, metaData, string.Empty);

            return metaData;
        }

        void GenerateForValidator(
            IValidator inputValidator,
            TypeMetaData metaData,
            string parentKey,
            bool shouldUseParentKey = false)
        {
            var inputValidatorType = inputValidator.GetType();
            var genericArguments = inputValidatorType.BaseType.GetGenericArguments();

            var descriptor = inputValidator.CreateDescriptor();
            var members = descriptor.GetMembersWithValidators();

            foreach (var member in members)
            {
                var isModelRule = member.Key == ModelRule<string>.ModelRulePropertyName || member.Key == string.Empty;
                var currentKey = (shouldUseParentKey || isModelRule) ? parentKey : GetKeyForMember(parentKey, member);
                var isConcept = new Lazy<bool>(() => IsConcept(genericArguments, isModelRule, member));

                foreach (var rule in descriptor.GetRulesForMember(member.Key))
                {
                    foreach (var validator in rule.Validators)
                    {
                        var childValidatorAdaptor = validator as ChildValidatorAdaptor;
                        if (childValidatorAdaptor != null)
                        {
                            var childValidator = childValidatorAdaptor.GetValidator(NullContext);
                            GenerateForValidator(childValidator, metaData, currentKey, isModelRule || isConcept.Value);
                        }
                        else
                        {
                            GenerateFor(metaData, currentKey, validator);
                        }
                    }
                }
            }
        }

        static bool IsConcept(Type[] genericArguments, bool isModelRule, IGrouping<string, IPropertyValidator> member)
        {
            if (genericArguments.Length == 1)
            {
                var type = isModelRule ? genericArguments[0] : genericArguments[0].GetProperty(member.Key).PropertyType;
                return type.IsConcept();
            }

            return false;
        }

#pragma warning restore 1591 // Xml Comments
        static string GetKeyForMember(string parentKey, IGrouping<string, IPropertyValidator> member)
        {
            return string.IsNullOrEmpty(parentKey)
                ? member.Key
                : $"{parentKey}.{member.Key.ToCamelCase()}";
        }

        void GenerateFor(TypeMetaData metaData, string property, IPropertyValidator validator)
        {
            var validatorType = validator.GetType();
            var types = new List<Type>();
            types.Add(validatorType);
            types.AddRange(validatorType.GetInterfaces());
            foreach (var type in types)
            {
                if (_generatorsByType.ContainsKey(type))
                {
                    var propertyName = property.ToCamelCase();
                    var rule = _generatorsByType[type].GeneratorFrom(property, validator);
                    var ruleName = rule.GetType().Name.ToCamelCase();
                    metaData[propertyName][ruleName] = rule;
                }
            }
        }

        static Dictionary<Type, ICanGenerateRule> Generators(IInstancesOf<ICanGenerateRule> ruleGenerators)
        {
            return ruleGenerators
                .SelectMany(generator => generator.From, (generator, type) => new { generator, type })
                .ToDictionary(d => d.type, d => d.generator);
        }
    }
}
