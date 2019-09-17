# IBM® CICS® Plug-in for Zowe CLI

[![codecov](https://codecov.io/gh/zowe/zowe-cli-cics-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/zowe/zowe-cli-cics-plugin)

The IBM CICS Plug-in for Zowe CLI lets you extend Zowe CLI to interact with IBM CICS programs and transactions.

- [How the plug-in works](#how-the-plug-in-works)
- [Software requirements](#software-requirements)
- [Installing](#installing)
- [Building from source](#building-from-source)
- [Creating a user profile](#creating-a-user-profile)
- [Running tests](#running-tests)
- [Uninstalling](#uninstalling)
- [Contributing](#contributing)

## How the plug-in works

As an application developer, you can use the plug-in to perform various CICS-related tasks, such as the following:

-   Deploy code changes to CICS applications that were developed with COBOL.
-   Deploy changes to CICS regions for testing or delivery.
-   Automate CICS interaction steps in your CI/CD pipeline with Jenkins Automation Server or TravisCI.

The plug-in uses the IBM CICS Management Client Interface (CMCI) API to achieve the interaction with CICS. For more information, see [CICS management client interface](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.3.0/com.ibm.cics.ts.clientapi.doc/topics/clientapi_overview.html) on the IBM Knowledge Center.

## Software requirements

Before you install and use the plug-in:

-   Install Zowe CLI on your computer.

    **Note:** For more information, see [Installing Zowe CLI](https://zowe.github.io/docs-site/latest/user-guide/cli-installcli.html).

-   Ensure that [IBM CICS Transaction Server v5.2](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.2.0/com.ibm.cics.ts.home.doc/welcomePage/welcomePage.html) or later is installed and running in your mainframe environment.

-   Ensure that [IBM CICS Management Client Interface (CMCI)](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.2.0/com.ibm.cics.ts.clientapi.doc/topics/clientapi_overview.html) is configured and running in your CICS region.

## Installing

Use one of the following methods to install the plug-in:

-   Install the plug-in from an online registry or a local package.

    Use the online registry/local package method when you simply want to install the plug-in to Zowe CLI and start using it.

    For more information, see [Installing plug-ins](https://zowe.github.io/docs-site/latest/user-guide/cli-installplugins.html) on the [Zowe Docs](https://zowe.github.io/docs-site/latest/) website.

-   Build the plug-in from source and install it into your Zowe CLI implementation.

    Use the build from source method when you want to install the plug-in to Zowe CLI using the most current binaries and modify the behavior of the plug-in. For example, you want to create a new command and use the plug-in with the command that you created.
    
    For more information, see [Building the plug-in from source](#building-the-plug-in-from-source).

## Building from source

<!-- TODO When @latest branch of Zowe docs-site exists, we should give users the option to go and read about/install the @latest or the @lts-incremental versions of this plug-in. We can also explain which branches in the repo correspond to which CLI version. -->

**Follow these steps:**

1.  The first time that you clone the IBM CICS Plug-in for Zowe CLI GitHub repository, issue the following command against the local directory:

    ```
    npm install
    ```
    The command installs the required dependencies for the plug-in and several development tools. You can run the task at any time to update the tools as needed.

2.  To build your code changes, issue the following command:
    ```
    npm run build
    ```
    The first time you build your code changes, you will be prompted for the location of the Imperative CLI Framework package, which is located in the `node_modules/@zowe` folder in the Zowe CLI home directory.

    **Note:** When you update `package.json` to include new dependencies, or when you pull changes that affect `package.json`, issue the `npm update` command to download the dependencies.

3.  Issue one of the following commands to install the plug-in:
        
    ```
    zowe plugins install @zowe/cics-for-zowe-cli
    ```
    Or:
    ```
    zowe plugins install .
    ```

**Tip:** After the installation process completes, it validates that the plug-in was installed correct and the names of its commands, options, and arguments do not conflict with that of the other plug-ins that you installed into your Zowe CLI implimentation.

When the validation process is successful, the following message displays:

```
Validation results for plugin 'cics':
Successfully validated.
```

When an unsuccessful message displays, you can troubleshoot the installation by addressing the issues that the message describes. You can also review the information that is contained in the log file in the Zowe CLI home directory.

## Creating a user profile

You can set up a CICS profile to avoid typing your connection details on every command. The profile contains your host, port, username, and password for the CMCI instance of your choice. You can create multiple profiles and switch between them if necessary. Issue the following command to create a cics profile:

```
zowe profiles create cics <profile name> -H <host> -P <port> -u <user> -p <password>
```

**Note:** For more information, issue the following command:
```
zowe profiles create cis --help
```

## Running tests

You can perform the following types of tests on the IBM CICS plug-in:

- Unit
- Integration
- System

**Note:** For detailed information about conventions and best practices for running tests against Zowe CLI plug-ins, see [Zowe CLI Plug-in Testing Guidelines](https://github.com/zowe/zowe-cli/blob/master/docs/PluginTESTINGGuidelines.md).

Before running the system and integration tests, IBM CICS Transaction Server v5.2 (or later) and IBM CICS Management Client Interface (CMCI) must be installed and running in your mainframe environment. For more information, see [Software requirements](#software-requirements).

To define access credentials to the server, copy the file named `.../__tests__/__resources__/properties/example_properties.yaml` and create a file named `.../__tests__/__resources__/properties/custom_properties.yaml`.

**Note:** Information about how to customize the `custom_properties.yaml` file is provided in the yaml file itself.

Issue the following commands to run the tests:

1. `npm run test:unit`
2. `npm run test:integration`
3. `npm run test:system`

Any failures potentially indicate an issue with the set-up of the Rest API or configuration parameters that were passed in the `custom_properties.yaml` file.

## Uninstalling

**Follow these steps:**

1.  To uninstall the plug-in from a base application, issue the following command:
    ```
    zowe plugins uninstall @zowe/cics-for-zowe-cli
    ```

After the uninstallation process completes successfully, the product no longer contains the plug-in.

## Contributing

For information about contributing to the plug-in, see the Zowe CLI [Contribution Guidelines](CONTRIBUTING.md). The guidelines contain standards and conventions for developing plug-ins for Zowe CLI. This includes information about running, writing, maintaining automated tests, developing consistent syntax in your plug-in, and ensuring that your plug-in integrates properly with Zowe CLI.

### Tutorials

To learn about building new commands or a new plug-in for Zowe CLI, see [Develop for Zowe CLI](https://zowe.github.io/docs-site/latest/extend/extend-cli/cli-devTutorials.html).

### Imperative CLI Framework documentation

[Imperative CLI Framework](https://github.com/zowe/imperative/wiki) documentation is a key source of information to learn about the features of Imperative CLI Framework (the code framework that you use to build plug-ins for Zowe CLI). Refer to the documentation as you develop your plug-in.
