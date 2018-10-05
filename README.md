# Zowe CLI Plug-in for IBM® CICS® 
The Zowe CLI Plug-in for IBM® CICS® lets you extend Zowe CLI to interact with IBM CICS programs and transactions. The plug-in uses the IBM CICS Management Client Interface (CMCI) API to achieve the interaction with CICS. For more information, see [CICS management client interface](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.3.0/com.ibm.cics.ts.clientapi.doc/topics/clientapi_overview.html) on the IBM Knowledge Center.

As an application developer, you can use the plug-in to perform various CICS-related tasks, such as the following:

* Deploy code changes to CICS applications that were developed with COBOL.
* Deploy changes to CICS regions for testing or delivery.
* Automate CICS interaction steps in your CI/CD pipeline with Jenkins Automation Server or TravisCI.

## Contribution Guidelines

For more information about general development guidelines and CICS plug-in specific information, see [the Contribution Guidelines](CONTRIBUTING.md).

**Tip:** Visit our [Sample Plug-in repository](https://github.com/zowe/zowe-cli-sample-plugin) and follow the [tutorials on the documentation site](https://zowe.github.io/docs-site/guides/cli-devTutorials) to start developing your first plug-in! 

## Prerequisites
Before you install the plug-in, meet the following prerequisites:
* Install Zowe CLI on your PC.
    
    **Note:** For more information, see the [Zowe CLI](https://zowe.github.io/docs-site/user-guide/cli-installcli.html) documentation.
* Ensure that [IBM® CICS® Management Client Interface (CMCI) API](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.3.0/com.ibm.cics.ts.clientapi.doc/topics/clientapi_overview.html) is installed and configured on your mainframe systems.

## Build the Plug-in from Source
**Follow these steps:**

1. The first time that you download the Zowe CLI plug-in for CICS from the GitHub repository, issue the following command against the local directory:

    ```
    npm install
    ```
    The command installs the required Zowe CLI Plug-in for CICS dependencies and several development tools. When necessary, you can run the task at any time to update the tools.

2. To build your code changes, issue the following command:

    ```
    npm run build
    ```

    The first time you build your code changes, you will be prompted for the location of the Imperative CLI Framework package, which is located in the `node_modules/@brightside` folder in the directory where Zowe CLI was installed.

    **Note:** When you update `package.json` to include new dependencies, or when you pull changes that affect `package.json`, issue the `npm update` command to download the dependencies.

## Install the Zowe CLI Plug-in for CICS

**Follow these steps:**

1.  Meet the prerequisites.
2.  Install the plug-in:
    ```
    zowe plugins install @brightside/cics
    ``` 
3.  (Optional) Verify the installation:
    ```
    zowe plugins validate @brightside/cics
    ```
    When you install the plug-in successfully, the following message displays:
    ```
    Validation results for plugin 'cics':
    Successfully validated.
    ``` 
    **Tip:** When an unsuccessful message displays, you can troubleshoot the installation by addressing the issues that the message describes. You can also review the information that is contained in the log file that is located in the directory where you installed Zowe CLI.  

4.  [Create a profile](#create-a-profile).

## Create a Profile
After you install the plug-in, you create a CICS profile. A CICS profile is required to issue commands in the CICS group that interact with CICS regions. CICS profiles contain your host, port, user name, and password for the IBM CMCI server of your choice. You can create multiple profiles and switch between them as needed.

**Follow these steps:**
1.  Create a CICS profile: 
    ```
    zowe profiles create cics <profile name> <host> <port> <user> <password>
    ```
    The result of the command displays as a success or failure message. You can use your profile when you issue commands in the cics command group.

**Tip:** For more information about the syntax, actions, and options, for a profiles create command, open Zowe CLI and issue the following command:

```
zowe profiles create cics -h
```

## Run Tests

For information about running automated, unit, and system and integration tests using the plug-in, see [Zowe CLI Plug-in Testing Guidelines](https://github.com/zowe/zowe-cli/master/docs/PluginTESTINGGuidelines.md).

## Uninstall the Plug-in

**Follow these steps:**
1.  To uninstall the plug-in from a base application, issue the following command:
    ```
    zowe plugins uninstall @brightside/cics
    ```
After the uninstallation process completes successfully, the product no longer contains the plug-in configuration.







