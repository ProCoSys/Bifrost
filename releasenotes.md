## Next version

### New procedure for bootstrapping the application [#30](https://github.com/ProCoSys/Bifrost/issues/30)
* Bootstrapping the application has been refactored out of the `Configure.DiscoverAndConfigure` method to the `Bifrost.Bootstrapping` namespace:
  * If you are using `DiscoverAndConfigure` without any parameters, there should be no changes.
  * If you are using `DiscoverAndConfigure` with parameters, you must wrap the parameters in an `IBootstrapConfiguration` object.
  * If you are using `Configure.With`, you must bind `IContainer`, `IImplementorFinder` and `IAssemblyProvider` and then manually initialize and bind the default bindings and conventions before calling `.With`.
  * In addition to specifying assemblies to include with `IAssembliesConfiguration`, you can also specify types to exclude with `ITypesConfiguration`. This could be useful if you want to override the defaults of some Bifrost classes.
* `ICollectTypes` has been added as a convention. Any class implementing this interface will be automatically instantiated and get notified of all types known by the application.
* An `IAutoBinder` service has been added. It can be used to all interfaces of an object to the object instance.
* The `IContractToImplementorsMap` interface has been cleaned up and moved to `Bifrost.Bootstrap.IImplementorFinder`.
* `ICanSpecifyAssemblies` was moved from `Bifrost.Execution` to `Bifrost.Configuration.Assemblies`.
* These less used interfaces were moved from `Bifrost.Execution` to `Bifrost.Bootstrap.Assemblies`:
  * `IAssemblyFilters`
  * `IAssemblySpecifiers`
  * `IAssemblyUtility`
  * `ICanProvideAssemblies`
* The `ITypeFinder` has been removed, as it was mostly a duplication of `ITypeDiscoverer`.

### ASP.NET MVC 5
Support for ASP.NET MVC 5 has been added with the new project `Bifrost.Web.Mvc5`. It contains the same code as `Bifrost.Web.Mvc`, but references MVC 5 assemblies instead of MVC 3. For compatibility reasons, the `FluentValidation` dependency had to be updated in all projects.

_Other changes_
* `Configure` has been cleaned up [#31](https://github.com/ProCoSys/Bifrost/issues/31)
  * The `Assemblies` property has been removed from `IConfigure`. Take a dependency on `IAssemblies` instead.
  * The `EntryAssembly` property has been removed from `IConfigure`. Use the static property on `Configure` instead.
* For performance reasons, `CommandSecurityProxies` now uses the Activator instead of the container to create command instances. This means all commands must have a default constructor. [#28](https://github.com/ProCoSys/Bifrost/issues/28)
* An `IConvention` interface has been created to increase discoverability of Convention over Configuration [#29](https://github.com/ProCoSys/Bifrost/issues/29)
* Fixed bug where `assetsManager` could initialize namespaces twice [#38](https://github.com/ProCoSys/Bifrost/issues/38)

## Version 2.3.0
_Breaking changes_
* There are no more `Func<Type>` methods of `IContainer` [#22](https://github.com/ProCoSys/Bifrost/issues/22)
* The `Bifrost.SimpleInjector` project has been deleted

_Other changes_
* Fixed bug when `CommandHandlerInvoker` is initialized asynchronously [#20](https://github.com/ProCoSys/Bifrost/issues/20)
* `CommandValidatorProvider` will now return null instead of an empty validator of the wrong type if the supplied type is not an `ICommand` [#24](https://github.com/ProCoSys/Bifrost/issues/24)

## Version 2.2.0
_Breaking changes_

* The `IAssemblyProvider` and `ICanProvideAssemblies` interfaces have been simplified, and `AssemblyProvider` is loading assemblies in another way. This might result in loading exceptions instead of them being swallowed. [#18](https://github.com/ProCoSys/Bifrost/issues/18)

## Version 2.1.0
_Breaking changes_

* `IContainer` does not expose a `DefaultLifecycle` anymore. The container implementation is responsible for selecting a default scope when services are bound without a specific scope [#16](https://github.com/ProCoSys/Bifrost/issues/16)

## Version 2.0.1
* Fixed problem with client side generating of dynamic validators [#14](https://github.com/ProCoSys/Bifrost/issues/14)

## Version 2.0.0
_Breaking changes_

* Many features and projects deleted
  * Silverlight
  * Mimir
  * WindowsPhone
  * WinRT
  * Mono
  * NETFX_CORE
  * Bifrost.Content
  * QuickStart.WPF
  * Bifrost.MSpec
  * Bifrost.TestApp
* Client side proxies will now be generated for dynamic input validators [dolittle#670](https://github.com/dolittle/Bifrost/issues/670)
* Correct `.NotNull` client side proxy for input validators [dolittle#671](https://github.com/dolittle/Bifrost/issues/671)
* All classes in Bifrost.Execution now works on `Assembly` instead of `_Assembly`
* Assembly specification is now opt-in (using `IncludeAssembliesStartingWith`) instead of opt-out (previously using `ExcludeAssembliesStartingWith`) [#6](https://github.com/ProCoSys/Bifrost/issues/6)

_Other changes_
* `AssetsManager` now provides an exclusion list [dolittle#668](https://github.com/dolittle/Bifrost/issues/668)
* Fix serialization caching bug using JSON.net [dolittle#676](https://github.com/dolittle/Bifrost/issues/676)
* Avoid `NullReferenceException` in `DefaultCallContext` [#7](https://github.com/ProCoSys/Bifrost/issues/7)
* Automatically discover all .hbm.xml mappings [#8](https://github.com/ProCoSys/Bifrost/issues/8)
* By implementing `IExceptionSubscriber`, it is now possible to receive callbacks when exceptions are encountered and handled [#9](https://github.com/ProCoSys/Bifrost/issues/9)
* In addition to `IInstancesOf` (see below), `IOrderedInstancesOf` is also supported, with ordering using the `After` and `Order` attributes


# Fork
Originally developed by [dolittle](http://bifrost.dolittle.com), the project was forked after
[development stopped](http://www.ingebrigtsen.info/2016/02/11/bifrost-end-of-the-line/) in February 2016.
The release notes below are adapted from http://bifrost.dolittle.com/ReleaseNotes.

## Version 1.0.0.31
* LocalPath used for assemblies during loading from the URI [dolittle#662](https://github.com/dolittle/Bifrost/issues/662)

## Version 1.0.0.30
* Fixed type discovery performance, both for startup and runtime [dolittle#657](https://github.com/dolittle/Bifrost/issues/657)

## Version 1.0.0.28 & 1.0.0.29
* Adding in support for assemblies without a location during assembly discovery

## Version 1.0.0.27
* `areAllParametersSet()` on query now supports observables [dolittle#655](https://github.com/dolittle/Bifrost/issues/655)
* Fixed NuGet package reference for FluentValidation to the signed version [dolittle#654](https://github.com/dolittle/Bifrost/issues/654)
* Added a package for the MVC project support (PS: this is MVC3, so good old)

## Version 1.0.0.26
* Removing `IExecutionEnvironment` - introducing `ICanProvideAssemblies` and rewriting how things work with assemblies [dolittle#650](https://github.com/dolittle/Bifrost/issues/650).

## Version 1.0.0.24 & 1.0.0.25
* Making it possible to override `IExecutionEnvironment` at startup - as a temporary solution till we get to [dolittle#650](https://github.com/dolittle/Bifrost/issues/650) & [dolittle#651](https://github.com/dolittle/Bifrost/issues/651)

## Version 1.0.0.22 & 1.0.0.23
* Improved weak delegates for Messenger
* Change to WeakDelegate for the CommandFor pipeline
* Ignoring dynamic assemblies for type discovery and assembly loading
* Started work on support for EntityFramework
* Making Proxy generation a part of core as it is needed for more than just clients
* Upgraded NHibernate support to the latest and greatest [dolittle#640](https://github.com/dolittle/Bifrost/issues/640)
* Fixing how assemblies are loaded and making configuration use the same mechanism.It is now possible to specify assemblies in a fluent way + a new interface that can be implemented for specifying assemblies to include or ignore in discovery mechanisms (`ICanSpecifyAssemblies`)
* JavaScript dependency resolver now only resolves dependency instances when needed [dolittle#646](https://github.com/dolittle/Bifrost/issues/646)
* Upgaded to .NET 4.5.1 for all projects

## Version 1.0.0.21
* Interface that you can implement to get notified when configuration is done - `IWantToKnowWhenConfigurationIsDone` [dolittle#598](https://github.com/dolittle/Bifrost/issues/598)
* `ICommandFor` callbacks are called per instance [dolittle#626](https://github.com/dolittle/Bifrost/issues/626)
* Explicit registration of `IMessenger` -> `Messenger` removed - marked with singleton
* Making designtime work properly without errors in Visual Studio for the ViewModel markup extension
* Making messenger use WeakReference [dolittle#601](https://github.com/dolittle/Bifrost/issues/601)

## Version 1.0.0.19 & 1.0.0.20
* Due to some strange behavior of the NuGet servers yielding error messages claiming errors in the Package metadata and also that versions where missing. We ended up releasing a couple of versions thinking our packages were corrupt. Therefore, these versions are exactly the same as 1.0.0.18.

## Version 1.0.0.18
* Added process callbacks for `ICommandFor<>` [dolittle#614](https://github.com/dolittle/Bifrost/issues/614)
* Configuring messenger for desktop when configuring for desktop (`Configure.Frontend.Desktop()`) - as a singleton [dolittle#617](https://github.com/dolittle/Bifrost/issues/617)

### Process Callbacks [dolittle#614](https://github.com/dolittle/Bifrost/issues/614)
```c#
public class ViewModel
{
    public ViewModel(ICommandFor<MyCommand> commandFor)
    {
        commandFor.Succeeded((cmd, result) => {
            // Things to do when successful
        });

        commandFor.Failed((cmd, result) => {
            // Things to do when failed
        });

        commandFor.Handled((cmd, result) => {
            // Things to do when handled
        });
    }
  }
```

## Version 1.0.0.17
* FromMethod extension in WPF/XAML client can now take an `IValueConverter` to use for converting parameters [dolittle#616](https://github.com/dolittle/Bifrost/issues/616)

### ParameterConverter [dolittle#616](https://github.com/dolittle/Bifrost/issues/616)
```html
<Button Command="{interaction:FromMethod NameOfMethod, CanExecuteWhen=NameOfMethodOrProperty, ParameterConverter={StaticResource AValueConverter}}"/>
```

## Version 1.0.0.16
* `FromMethod` extension in WPF/XAML client now supports `CanExecute` [dolittle#612](https://github.com/dolittle/Bifrost/issues/612)
* `ICommandFor<>` can now be generated from a concrete instance of a command [dolittle#611](https://github.com/dolittle/Bifrost/issues/611)
* Fix for assembly filtering to filter assemblies delay loaded after initial initialization [dolittle#613](https://github.com/dolittle/Bifrost/issues/613)

### CanExecute for FromMethod
In the Interaction namespace of Bifrost when using the client, you'll find a markup extension called `FromMethod`. This extension now supports the capability of taking
```html
<Button Command="{interaction:FromMethod NameOfMethod, CanExecuteWhen=NameOfMethodOrProperty}"/>
```
The `CanExecuteWhen` property of the extension is optional and can take either a method or a property. If it is a method, the method can be a method without any parameters or with one parameter and the command parameter will then be passed in. The return type needs to be of type bool, same goes for if it is a property. If the declaring type implements `INotifyPropertyChanged` and you're specifying a property - it will trigger a `CanExecuteChanged` event for the returning command when the property changed so it can be evaluated by the WPF infrastructure again.

## Version 1.0.0.15
* Configure startup now uses same `AssemblyProvider` as the rest of the system

## Version 1.0.0.14
* `ICommandFor<>` support for client in place with full proxy generation of the frontend concerns. Fully bindable in XAML.

## Version 1.0.0.13
* AssemblyFiltering for startup in place. For now accessible from the `DiscoverAndConfigure()` method on the configure object
### Usage
For instance, lets say you have a WPF application, the way you would use this is would be in your App.xaml.cs file:
```c#
using Bifrost.Configuration;
using Bifrost.Configuration.Assemblies;

namespace YourApp
{
    public partial class App : Application
    {
        static App()
        {
            Configure.DiscoverAndConfigure(a=>
                a.IncludeAll()
                    .ExceptAssembliesStartingWith("System","Microsoft"));
        }
    }
}
```
In the future there will be other mechanisms as well which would apply better for Web scenarios where one does not call `DiscoverAndConfigure` manually. Also, the sample above with "System" and "Microsoft" will eventually be something Bifrost itself will filter, this is linked to the future mechanism coming.

## Version 1.0.0.12
* XAML Visual Tree extensions
* Adding better check for wether or not an assembly is a .NET assembly during location instead of relying on `BadImageException`
* Temporarily disabling Windows Phone version of Client - will return in a future release
* DocumentDB strategies for collection storage - default implementation puts all entity types in same collection called entities. Query support for getting correct entities when asking for a specific type.
* Added `FromMethod` MarkupExtension for XAML clients for pointing directly to a method on your ViewModel for the Command property of things like Button.
* Enabling strong name signing - for same reason this was not enabled
* Introducing a ViewModel MarkupExtension for XAML clients that takes the type of ViewModel and it will use the container to instantiate it. Used for the DataContext property typically.
* Started work on a better way to filter assemblies you don't want to discover types for. Early days.
* Putting in place DesktopConfiguration for the WPF client
* Changing one of the overloads for IOC containers for Bind when binding to a Func. It now takes the type being bound to.

## Version 1.0.0.11
* Support for derived query types [dolittle#538](https://github.com/dolittle/Bifrost/issues/538)
* Required rule more robust
* Fixed generation of Queryable extensions for `.Skip` and `.Take` [dolittle#540](https://github.com/dolittle/Bifrost/issues/540)
* Started work on DocumentDB implementation - EventStore is up and running [dolittle#531](https://github.com/dolittle/Bifrost/issues/531)
* Started work on new validation and business rules engine based on a new underlying rule engine
* FluentValidation moved into its own components - Bifrost.FluentValidation - available as its own NuGet package
* Improving the naive file system based EventStore and EntityContexts
* Improved QuickStart to showcase more features - this still need to be worked on a lot to actually cover all features.
* Started work on query validation support [dolittle#382](https://github.com/dolittle/Bifrost/issues/382)
* `ICanResolvePrinicpal` implementation automatically discovered [dolittle#549](https://github.com/dolittle/Bifrost/issues/549)
* Added ViewModelService for XAML based clients
* Support for SimpleInjector [dolittle#568](https://github.com/dolittle/Bifrost/issues/568)
* Handling of missing properties for mapping in JavaScript fixed [dolittle#585](https://github.com/dolittle/Bifrost/issues/585)
* Improving XML comments in general
* Added MethodInfoConverter to JSON component
* Started work on mapping support for C# - needed for DocumentDB support, amongst others
* Heavy work on the new control, binding and object model for JavaScript
* Improved `isObject()` check when checking "undefined" for JavaScript
* Code quality work with the help of NDepend
* Updated 3rd party references
  * Newtonsoft Json - 6.0.8
  * Ninject - 3.2.2.0
  * SignalR - 2.2.0

## Version 1.0.0.10
* Making everything compile against .net 4.5
* Updated 3rd party references
  * Newtonsoft Json - 6.0.5
  * Ninject - 3.2.0.0
  * RavenDB - 2.5.2916
  * MongoDB - 1.9.2
  * SignalR - 2.1.2
  * Unity - 3.5.1404.0
  * AutoFac - 3.5.2
* Exposing StructureMap IOC support as Nuget package
* Exposing Unity IOC support as Nuget package
* Exposing AutoFac IOC support as Nuget package
* Exposint Windsor IOC support as Nuget package
* Retiring dedicated SignalR component - merged into the Web component. Consequence is SignalR is now front and center of everything moving forward.
* Introducing a simple JSON File based EventStore implementation - mostly for demo purposes
* Introducing a simple JSON File based EntityContext implementation - mostly for demo purposes
* Cleaning up QuickStart
* Easier and more convenient way to import types [dolittle#534](https://github.com/dolittle/Bifrost/issues/534)
* Fixing bugs related to client mapping of objects [dolittle#524](https://github.com/dolittle/Bifrost/issues/524), [dolittle#522](https://github.com/dolittle/Bifrost/issues/522)
* Fixed deserialization of Concepts based on Guids [dolittle#513](https://github.com/dolittle/Bifrost/issues/513)
* Fixing IE issues with mapping and type recognition. IE does not hold a property called name for the constructor property. Regex to the rescue.
* Started work on the new rule engine. First implementation targets queries and validation of these. This is the first step in moving away from FluentValidation.
* Fixing a lot of "system" properties to be prefixed with an underscore - avoiding naming conflicts
* Rules namespace holding a specification implementation is now called Specifications both in C# and JavaScript
* BundleTables routes from System.Web.Optimization are now recognized and will be ignored for the SPA HTTP request handling

### More convenient way to import instances of types - [dolittle#534](https://github.com/dolittle/Bifrost/issues/534)
In Bifrost we have something called `ITypeImporter` and `ITypeDiscoverer`. The importer imports the types as instances, that means the implementation uses the IOC container to resolve an instance when calling the `.Import<>()` methods. The discoverer is responsible for just discovering the types when calling the `Find<>()` methods and has nothing to do with instances. With this release, we're introducing something that makes this whole thing more explicit, clearer and easier to use. There is now an interface called `IInstancesOf<>` that you can take a dependency on. The interface inherits IEnumerable<> and as a consequence the implementation `InstancesOf<>` will do the instantiation when its enumerated. The way you can use this is:
```c#
using Bifrost.Execution;

namespace MyNamespace
{
    public class MySystem
    {
        public MySystem(IInstancesOf<SomeAbsractOrInterfaceType> instances)
        {
            // The enumerator will now instantiate through the IOC container
            // giving you an instance with correct lifecycle
            foreach( var instance in instances ) 
            {
            }
        }
    }
}
```

### SignalR support
We are now generating Bifrost proxies for hubs - these are placed in the namespace corresponding to the namespace maps set up for the application. Once you have created a hub like so:
```c#
using Microsoft.AspNet.SignalR;

namespace Web.BoudedContext.Module
{
    public class MyHub : Hub
    {
        public int DoSomething(int someInteger, string someString)
        {
            return 42;
        }
    }
}
```
From your JavaScript - for instance a ViewModel, you can now do this:
```javascript
Bifrost.namespace("Web.BoundedContext.Module", {
    myFeature: Bifrost.views.ViewModel.extend(function(myHub) {

        myHub.server.doSomething(43,"fourty three")
                .continueWith(function(result) {
            // Result should be 42...
        });
    });
});
```
The "myHub" dependency will automatically be injected by convention. All hubs are placed in the closest matching namespace. If none is found, there is a global namespace called hubs that will hold it. The last dependency resolver in the chain will be the one that recognizes the global namespace and it will always be found.

With this you don't have to think about starting the SignalR Hub connection like one would have to do with a bare SignalR. Bifrost manages this on the first hub being used.

You might notice that instead of what might be expected when working with SignalR for results coming back from calls to the server:
```javascript
.done(function() {}) 
```
We are using the Bifrost promise instead. This is because we want consistency with Bifrost, not with SignalRs proxies. In fact, we are not using the SignalR proxies at all, but our own proxy generation engine as we use for the generation of proxies for Commands, Queries, ReadModels, Security, Validation and more.

If you want to set up client funtions that you want for the particular Hub instances, you can do this by doing the following:
```javascript
myHub.client(function(client) {
    client.doSomething = function(someString, someNumber) {
        // Do things in the client called from the server
    };
});
```
This will subscribe to any method calls from the server corresponding to the name of the function. The above code can be called anytime, there is no ordering to think of as with vanilla SignalR were you have to do this prior to starting the Hub connection.