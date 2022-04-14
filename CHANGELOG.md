# Changelog

All notable changes to the IBM® CICS® Plug-in for Zowe CLI will be documented in this file.

## `5.0.0-next.202204141925`

- BugFix: Remove APIML Conn Lookup until the CICS definition for APIML is known.

## `5.0.0-next.202204111400`

- BugFix: Fixed daemon mode prompting

## `5.0.0-next.202202071745`

- BugFix: Pruned dev dependencies from npm-shrinkwrap file.

## `5.0.0-next.202201261655`

- BugFix: Updated dependencies to resolve security vulnerabilities.

## `5.0.0-next.202201241457`

- BugFix: Included an npm-shrinkwrap file to lock-down all transitive dependencies.

## `5.0.0-next.202107021819`

- Enhancement: Add apimlConnLookup properties to enable auto-config through APIML. A valid apiId must still be identified.

## `5.0.0-next.202104261510`

- Remove @zowe/cli peer dependency to better support NPM v7

## `5.0.0-next.202104141723`

- Publish `@next` tag that is compatible with team config profiles.

## `4.0.7`

- BugFix: Updated `moment` dependency.

## `4.0.6`

- BugFix: Pruned dev dependencies from npm-shrinkwrap file.

## `4.0.5`

- BugFix: Included an npm-shrinkwrap file to lock-down all transitive dependencies.

## `4.0.3`

- BugFix: Update Readme links

## `4.0.2`

- Tag version 4.X.X as @zowe-v1-lts

## `4.0.1`

- Update Imperative dev dependency to fix deployment and remove vulnerability

## `4.0.0`

- Default CMCI protocol to HTTPS
- Default URIMaps created to HTTPS
- Add options to specify TCPIPSERVICE to Server and Pipeline URIMaps
- Add options to specify Certificates and Authentication to Client URIMaps
- Add system test property to specify Certificate to use
