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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Bifrost.Extensions
{
    /// <summary>
    /// Provides a set of methods for working with <see cref="Type">types</see>
    /// </summary>
    public static class TypeExtensions
    {
        static HashSet<Type> AdditionalPrimitiveTypes = new HashSet<Type>
            {
                typeof(decimal),typeof(string),typeof(Guid),typeof(DateTime),typeof(DateTimeOffset),typeof(TimeSpan)
            };

        static HashSet<Type> NumericTypes = new HashSet<Type>
        {
            typeof(byte), typeof(sbyte),
            typeof(short), typeof(int), typeof(long),
            typeof(ushort), typeof(uint), typeof(ulong),
            typeof(double), typeof(decimal), typeof(Single)
        };
#pragma warning disable 1591 // Xml Comments
        static ITypeInfo GetTypeInfo(Type type)
        {
            var typeInfoType = typeof(TypeInfo<>).MakeGenericType(type);
            return typeInfoType.GetField("Instance", BindingFlags.Public | BindingFlags.Static).GetValue(null) as ITypeInfo;
        }
#pragma warning restore 1591 // Xml Comments

        /// <summary>
        /// Check if a type has an attribute associated with it
        /// </summary>
        /// <typeparam name="T">Type to check</typeparam>
        /// <returns>True if there is an attribute, false if not</returns>
        public static bool HasAttribute<T>(this Type type) where T : Attribute
        {
            var attributes = type.GetCustomAttributes(typeof(T), false);
            return attributes.Length == 1;
        }

        /// <summary>
        /// Check if a type is nullable or not
        /// </summary>
        /// <param name="type"><see cref="Type"/> to check</param>
        /// <returns>True if type is nullable, false if not</returns>
        public static bool IsNullable(this Type type)
        {
            return (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>));
        }

        /// <summary>
        /// Check if a type is a number or not
        /// </summary>
        /// <param name="type"><see cref="Type"/> to check</param>
        /// <returns>True if type is numeric, false if not</returns>
        public static bool IsNumericType(this Type type)
        {
            return NumericTypes.Contains(type) ||
                   NumericTypes.Contains(Nullable.GetUnderlyingType(type));
        }

        /// <summary>
        /// Check if a type is a Date or not
        /// </summary>
        /// <param name="type"><see cref="Type"/> to check</param>
        /// <returns>True if type is a date, false if not</returns>
        public static bool IsDate(this Type type)
        {
            return type == typeof (DateTime) || Nullable.GetUnderlyingType(type) == typeof (DateTime);
        }

        /// <summary>
        /// Check if a type is a Boolean or not
        /// </summary>
        /// <param name="type"><see cref="Type"/> to check</param>
        /// <returns>True if type is a boolean, false if not</returns>
        public static bool IsBoolean(this Type type)
        {
            return type == typeof (Boolean) || Nullable.GetUnderlyingType(type) == typeof (Boolean);
        }

        /// <summary>
        /// Check if a type has a default constructor that does not take any arguments
        /// </summary>
        /// <param name="type">Type to check</param>
        /// <returns>true if it has a default constructor, false if not</returns>
        public static bool HasDefaultConstructor(this Type type)
        {
            return GetTypeInfo(type).HasDefaultConstructor;
        }


        /// <summary>
        /// Check if a type has a non default constructor
        /// </summary>
        /// <param name="type">Type to check</param>
        /// <returns>true if it has a non default constructor, false if not</returns>
        public static bool HasNonDefaultConstructor(this Type type)
        {
            return type.GetConstructors().Any(c => c.GetParameters().Length > 0);
        }


        /// <summary>
        /// Get the default constructor from a type
        /// </summary>
        /// <param name="type">Type to get from</param>
        /// <returns>The default <see cref="ConstructorInfo"/></returns>
        public static ConstructorInfo GetDefaultConstructor(this Type type)
        {
            return type.GetConstructors().Where(c => c.GetParameters().Length == 0).Single();
        }

        /// <summary>
        /// Get the non default constructor, assuming there is only one
        /// </summary>
        /// <param name="type">Type to get from</param>
        /// <returns>The <see cref="ConstructorInfo"/> for the constructor</returns>
        public static ConstructorInfo GetNonDefaultConstructor(this Type type)
        {
            return type.GetConstructors().Where(c => c.GetParameters().Length > 0).Single();
        }


        /// <summary>
        /// Check if a type implements a specific interface
        /// </summary>
        /// <typeparam name="T">Interface to check for</typeparam>
        /// <param name="type">Type to check</param>
        /// <returns>True if the type implements the interface, false if not</returns>
        public static bool HasInterface<T>(this Type type)
        {
            var hasInterface = type.HasInterface(typeof (T));
            return hasInterface;
        }

        /// <summary>
        /// Check if a type implements a specific interface
        /// </summary>
        /// <param name="type">Type to check</param>
        /// <param name="interfaceType">Interface to check for</param>
        /// <returns>True if the type implements the interface, false if not</returns>
        public static bool HasInterface(this Type type, Type interfaceType)
        {
            var hasInterface = type.GetInterface(interfaceType.FullName, false) != null;
            return hasInterface;
        }

        /// <summary>
        /// Check if a type derives from an open generic type
        /// </summary>
        /// <param name="type"></param>
        /// <param name="openGenericType"></param>
        /// <returns></returns>
        public static bool IsDerivedFromOpenGeneric(this Type type, Type openGenericType)
        {
            var typeToCheck = type;
            while (typeToCheck != null && typeToCheck != typeof(object))
            {
                var currentType = typeToCheck.IsGenericType ? typeToCheck.GetGenericTypeDefinition() : typeToCheck;
                if (openGenericType == currentType)
                {
                    return true;
                }
                typeToCheck = typeToCheck.BaseType;
            }
            return false;
        }

        /// <summary>
        /// Check if a type implements an open generic type
        /// </summary>
        /// <param name="type"></param>
        /// <param name="openGenericType"></param>
        /// <returns></returns>
        public static bool ImplementsOpenGeneric(this Type type, Type openGenericType)
        {
            var openGenericTypeInfo = openGenericType.GetTypeInfo();
            var typeInfo = type.GetTypeInfo();
            return typeInfo.GetInterfaces()
                .Where(i => i.IsGenericType)
                .Where(i => i.GetGenericTypeDefinition() == openGenericTypeInfo)
                .Any();
        }
        /// <summary>
        /// Check if a type is a "primitve" type.  This is not just dot net primitives but basic types like string, decimal, datetime,
        /// that are not classified as primitive types.
        /// </summary>
        /// <param name="type">Type to check</param>
        /// <returns>True if a "primitive"</returns>
        public static bool IsAPrimitiveType(this Type type)
        {
            return type.IsPrimitive || type.IsNullable() || AdditionalPrimitiveTypes.Contains(type) || type == typeof(decimal);
        }


        /// <summary>
        /// Check if a type implements another type - supporting interfaces, abstract types, with or without generics
        /// </summary>
        /// <param name="type">Type to check</param>
        /// <param name="super">Super / parent type to check against</param>
        /// <returns>True if derived, false if not</returns>
        public static bool Implements(this Type type, Type super)
        {
            return type.AllBaseAndImplementingTypes().Contains(super);
        }

        /// <summary>
        /// Returns all base types of a given type, both open and closed generic (if any), including itself.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static IEnumerable<Type> AllBaseAndImplementingTypes(this Type type)
        {
            return type.BaseTypes()
                .Concat(type.GetInterfaces())
                .SelectMany(ThisAndMaybeOpenType)
                .Where(t=>t != type && t != typeof(Object));
        }

        static IEnumerable<Type> BaseTypes(this Type type)
        {
            var currentType = type;
            while (currentType != null)
            {
                yield return currentType;
                currentType = currentType.BaseType;
            }
        }

        static IEnumerable<Type> ThisAndMaybeOpenType(Type type)
        {
            yield return type;
            if (type.IsGenericType && !type.ContainsGenericParameters)
            {
                yield return type.GetGenericTypeDefinition();
            }
        }
    }
}
