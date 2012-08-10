﻿#region License
//
// Copyright (c) 2008-2012, DoLittle Studios AS and Komplett ASA
//
// Licensed under the Microsoft Permissive License (Ms-PL), Version 1.1 (the "License")
// With one exception :
//   Commercial libraries that is based partly or fully on Bifrost and is sold commercially,
//   must obtain a commercial license.
//
// You may not use this file except in compliance with the License.
// You may obtain a copy of the license at
//
//   http://bifrost.codeplex.com/license
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
using System.Linq.Expressions;
using System.Web.Mvc;
using System.Web.Routing;
using Bifrost.Commands;
using System.Reflection;

namespace Bifrost.Web.Mvc.Commands
{
    /// <summary>
    /// Provides Html helper methods for Commands
    /// </summary>
    public static class CommandHtmlHelper
    {
        /// <summary>
        /// Begins a <see cref="CommandForm{T}"/>, with default <see cref="FormMethod.Post"/> as method and will autodiscover any
        /// action on the controller taking the type of <see cref="ICommand">command</see> specified.
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <typeparam name="TC">Type of controller holding the action to forward to</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        public static CommandForm<T> BeginCommandForm<T, TC>(this HtmlHelper htmlHelper)
            where T : ICommand, new()
            where TC : ControllerBase
        {
            var actions = GetActionsForCommand<T, TC>();

            ThrowIfAmbiguousAction<T, TC>(actions);
            ThrowIfMissingAction<T, TC>(actions);
            
            var controllerName = GetControllerNameFromType<TC>();
            var command = htmlHelper.BeginCommandForm<T>(actions.First().Name, controllerName, FormMethod.Post, new Dictionary<string, object>());
            return command;
        }

        /// <summary>
        /// Begins a <see cref="CommandForm{T}"/>, with default <see cref="FormMethod.Post"/> as method
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <typeparam name="TC">Type of controller holding the action to forward to</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <param name="expression">Expression holding information about the action on the controller to use</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        /// <remarks>
        /// For the expression that expressed the action to use, it does not care about the parameters for the action, so these
        /// can be set to null. The expression just represents the action strongly typed.
        /// </remarks>
        public static CommandForm<T> BeginCommandForm<T, TC>(this HtmlHelper htmlHelper, Expression<Func<TC, ActionResult>> expression)
            where T : ICommand, new()
            where TC : ControllerBase
        {
            var command = htmlHelper.BeginCommandForm<T, TC>(expression, FormMethod.Post, new Dictionary<string, object>());
            return command;
        }

        /// <summary>
        /// Begins a <see cref="CommandForm{T}"/>, with default <see cref="FormMethod.Post"/> as method
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <typeparam name="TC">Type of controller holding the action to forward to</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <param name="expression">Expression holding information about the action on the controller to use</param>
        /// <param name="htmlAttributes">An object that contains the HTML attributes to be set for the element</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        /// <remarks>
        /// For the expression that expressed the action to use, it does not care about the parameters for the action, so these
        /// can be set to null. The expression just represents the action strongly typed.
        /// </remarks>
        public static CommandForm<T> BeginCommandForm<T, TC>(this HtmlHelper htmlHelper, Expression<Func<TC, ActionResult>> expression, IDictionary<string, object> htmlAttributes)
            where T : ICommand, new()
            where TC : ControllerBase
        {
            var command = htmlHelper.BeginCommandForm<T, TC>(expression, FormMethod.Post,htmlAttributes);
            return command;
        }

        /// <summary>
        /// Begins a <see cref="CommandForm{T}"/>, with default <see cref="FormMethod.Post"/> as method
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <typeparam name="TC">Type of controller holding the action to forward to</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <param name="expression">Expression holding information about the action on the controller to use</param>
        /// <param name="htmlAttributes">An object that contains the HTML attributes to be set for the element</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        /// <remarks>
        /// For the expression that expressed the action to use, it does not care about the parameters for the action, so these
        /// can be set to null. The expression just represents the action strongly typed.
        /// </remarks>
        public static CommandForm<T> BeginCommandForm<T, TC>(this HtmlHelper htmlHelper, Expression<Func<TC, ActionResult>> expression, object htmlAttributes)
            where T : ICommand, new()
            where TC : ControllerBase
        {
            var command = htmlHelper.BeginCommandForm<T, TC>(expression, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
            return command;
        }

        /// <summary>
        /// Begins a CommandForm
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <typeparam name="TC">Type of controller holding the action to forward to</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <param name="expression">Expression holding information about the action on the controller to use</param>
        /// <param name="formMethod"><see cref="FormMethod"/> to use</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        /// <remarks>
        /// For the expression that expressed the action to use, it does not care about the parameters for the action, so these
        /// can be set to null. The expression just represents the action strongly typed.
        /// </remarks>
        public static CommandForm<T> BeginCommandForm<T, TC>(this HtmlHelper htmlHelper, Expression<Func<TC, ActionResult>> expression, FormMethod formMethod)
            where T : ICommand, new()
            where TC : ControllerBase
        {
            return htmlHelper.BeginCommandForm<T, TC>(expression, formMethod, new Dictionary<string, object>());
        }

        /// <summary>
        /// Begins a CommandForm
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <typeparam name="TC">Type of controller holding the action to forward to</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <param name="expression">Expression holding information about the action on the controller to use</param>
        /// <param name="formMethod"><see cref="FormMethod"/> to use</param>
        /// <param name="htmlAttributes">An object that contains the HTML attributes to be set for the element</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        /// <remarks>
        /// For the expression that expressed the action to use, it does not care about the parameters for the action, so these
        /// can be set to null. The expression just represents the action strongly typed.
        /// </remarks>
        public static CommandForm<T> BeginCommandForm<T, TC>(this HtmlHelper htmlHelper, Expression<Func<TC, ActionResult>> expression, FormMethod formMethod, IDictionary<string, object> htmlAttributes)
            where T : ICommand, new()
            where TC : ControllerBase
        {
            var lambda = expression as LambdaExpression;
            if( null != lambda )
            {
                var methodCallExpression = lambda.Body as MethodCallExpression;
                if( null != methodCallExpression )
                {
                    var actionName = methodCallExpression.Method.Name;
                    var controllerName = GetControllerNameFromType<TC>();
                    var commandForm = BeginCommandForm<T>(htmlHelper, actionName, controllerName, formMethod, htmlAttributes);
                    return commandForm;
                }
            }

            return null;
        }

        /// <summary>
        /// Begins a CommandForm
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <typeparam name="TC">Type of controller holding the action to forward to</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <param name="expression">Expression holding information about the action on the controller to use</param>
        /// <param name="formMethod"><see cref="FormMethod"/> to use</param>
        /// <param name="htmlAttributes">An object that contains the HTML attributes to be set for the element</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        /// <remarks>
        /// For the expression that expressed the action to use, it does not care about the parameters for the action, so these
        /// can be set to null. The expression just represents the action strongly typed.
        /// </remarks>
        public static CommandForm<T> BeginCommandForm<T, TC>(this HtmlHelper htmlHelper, Expression<Func<TC, ActionResult>> expression, FormMethod formMethod, object htmlAttributes)
            where T : ICommand, new()
            where TC : ControllerBase
        {
            return  htmlHelper.BeginCommandForm<T, TC>(expression, FormMethod.Post, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
        }


        /// <summary>
        /// Begins a CommandForm
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <param name="actionName">Action to call on the controller</param>
        /// <param name="controllerName">Controller the action belongs to</param>
        /// <param name="formMethod"><see cref="FormMethod"/> to use</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        public static CommandForm<T> BeginCommandForm<T>(this HtmlHelper htmlHelper, string actionName, string controllerName, FormMethod formMethod)
            where T : ICommand, new()
        {
            return htmlHelper.BeginCommandForm<T>(actionName, controllerName, formMethod, new Dictionary<string, object>());
        }

        /// <summary>
        /// Begins a CommandForm
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <param name="actionName">Action to call on the controller</param>
        /// <param name="controllerName">Controller the action belongs to</param>
        /// <param name="formMethod"><see cref="FormMethod"/> to use</param>
        /// <param name="htmlAttributes">An object that contains the HTML attributes to be set for the element</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        public static CommandForm<T> BeginCommandForm<T>(this HtmlHelper htmlHelper, string actionName, string controllerName, FormMethod formMethod, IDictionary<string, object> htmlAttributes)
            where T : ICommand, new()
        {
            var formAction = UrlHelper.GenerateUrl(null, actionName, controllerName, new RouteValueDictionary(), htmlHelper.RouteCollection, htmlHelper.ViewContext.RequestContext, true);
            var form = FormHelper<T>(htmlHelper, formAction, actionName, controllerName, formMethod, htmlAttributes);
            return form;
        }

        /// <summary>
        /// Begins a CommandForm
        /// </summary>
        /// <typeparam name="T">Type of Command to create form for</typeparam>
        /// <param name="htmlHelper">HtmlHelper to begin a command form within</param>
        /// <param name="actionName">Action to call on the controller</param>
        /// <param name="controllerName">Controller the action belongs to</param>
        /// <param name="formMethod"><see cref="FormMethod"/> to use</param>
        /// <param name="htmlAttributes">An object that contains the HTML attributes to be set for the element</param>
        /// <returns>A <see cref="CommandForm{T}"/></returns>
        public static CommandForm<T> BeginCommandForm<T>(this HtmlHelper htmlHelper, string actionName, string controllerName, FormMethod formMethod, object htmlAttributes)
           where T : ICommand, new()
        {
            return htmlHelper.BeginCommandForm<T>(actionName, controllerName, formMethod, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
        }

        static CommandForm<T> FormHelper<T>(this HtmlHelper htmlHelper, string formAction, string action, string controller, FormMethod method, IDictionary<string, object> htmlAttributes)
            where T : ICommand, new()
        {
            htmlAttributes = htmlAttributes ?? new Dictionary<string, object>();

            var builder = new TagBuilder("form");
            builder.MergeAttribute("action", formAction);
            builder.MergeAttribute("method", HtmlHelper.GetFormMethodString(method), true);
            builder.MergeAttribute("data-commandForm","",true);
            if (htmlHelper.ViewContext.ClientValidationEnabled)
            {
                if (!htmlAttributes.ContainsKey("id"))
                {
                    builder.GenerateId(typeof (T).Name);
                }
            }
            builder.MergeAttributes(htmlAttributes);
            htmlHelper.ViewContext.Writer.Write(builder.ToString(TagRenderMode.StartTag));
            var form = new CommandForm<T>(htmlHelper.ViewContext);
            form.Action = action;
            form.Controller = controller;
            if (htmlHelper.ViewContext.ClientValidationEnabled)
            {
                htmlHelper.ViewContext.FormContext.FormId = builder.Attributes["id"];
            }
            return form;
        }


        static IEnumerable<MethodInfo> GetActionsForCommand<T, TC>()
            where T : ICommand, new()
            where TC : ControllerBase
        {
            var controllerType = typeof(TC);
            var commandType = typeof(T);
            var methods = controllerType.GetMethods(BindingFlags.Public | BindingFlags.Instance);
            var actions = methods
                .Where(m => typeof(ActionResult).IsAssignableFrom(m.ReturnType))
                .Where(m => m.GetParameters().Any(p => p.ParameterType == commandType))
                .ToArray();
            return actions;
        }

        static void ThrowIfMissingAction<T, TC>(IEnumerable<MethodInfo> methods)
        {
            if (methods.Count() == 0)
                throw new MissingActionException(typeof(T), typeof(TC));
        }

        static void ThrowIfAmbiguousAction<T, TC>(IEnumerable<MethodInfo> methods)
        {
            if (methods.Count() > 1)
                throw new AmbiguousActionException(typeof(T), typeof(TC));
        }


        static string GetControllerNameFromType<TC>()
        {
            const string controllerString = "Controller";
            var name = typeof(TC).Name;
            var lastIndex = name.LastIndexOf(controllerString);

            if( lastIndex > 0 )
                name = name.Remove(lastIndex,controllerString.Length);

            return name;
        }
    }
}
