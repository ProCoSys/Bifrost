@echo off
setlocal EnableDelayedExpansion

REM === Exctract version from version.txt ===
for /f "tokens=* delims= " %%a in (version.txt) do set line=%%a
for /f %%a in ("!line!") do set version=%%a
echo Version is %version%.
echo.


REM === Setup configuration ===
set configuration=%2
if "%configuration%"=="" (
  set configuration=Debug
)

REM === Setup path to NuGet ===
set nuget=%3
if "%nuget%"=="" (
  set nuget=NuGet.exe
)

REM === Setup output directory ===
set outputDirectory=..\NuGet\Packages\%configuration%
mkdir %~dp0\%outputDirectory%\
del %~dp0\%outputDirectory%\*.nupkg /F

REM === Creating project packages ===
%nuget% pack "%~dp0\Bifrost\Bifrost.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
%nuget% pack "%~dp0\Bifrost.FluentValidation\Bifrost.FluentValidation.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
%nuget% pack "%~dp0\Bifrost.CommonServiceLocator\Bifrost.CommonServiceLocator.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
REM %nuget% pack "%~dp0\Bifrost.Client\Bifrost.Client.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
%nuget% pack "%~dp0\Bifrost.JSON\Bifrost.JSON.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
REM %nuget% pack "%~dp0\Bifrost.AutoFac\Bifrost.AutoFac.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
REM %nuget% pack "%~dp0\Bifrost.Ninject\Bifrost.Ninject.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
REM %nuget% pack "%~dp0\Bifrost.StructureMap\Bifrost.StructureMap.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
REM %nuget% pack "%~dp0\Bifrost.Unity\Bifrost.Unity.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
REM %nuget% pack "%~dp0\Bifrost.Windsor\Bifrost.Windsor.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
%nuget% pack "%~dp0\Bifrost.Web\Bifrost.Web.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
%nuget% pack "%~dp0\Bifrost.Web.Mvc\Bifrost.Web.Mvc.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
REM %nuget% pack "%~dp0\Bifrost.RavenDB\Bifrost.RavenDB.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
REM %nuget% pack "%~dp0\Bifrost.MongoDB\Bifrost.MongoDB.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
REM %nuget% pack "%~dp0\Bifrost.DocumentDB\Bifrost.DocumentDB.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive
%nuget% pack "%~dp0\Bifrost.NHibernate\Bifrost.NHibernate.csproj" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -IncludeReferencedProjects -NonInteractive

REM === Creating other packages ===
%nuget% pack "%~dp0\Bifrost.JavaScript\Bifrost.JS.nuspec" -p Configuration=%configuration% -OutputDirectory "%~dp0\%outputDirectory%" -Version %version% -NonInteractive

REM === Copy to package source ===
if "%1"=="Publish" (
  copy "%~dp0\%outputDirectory%\*%version%*.nupkg" \\st-w761\nuget\%configuration%
)

echo.
echo Finished
echo.
