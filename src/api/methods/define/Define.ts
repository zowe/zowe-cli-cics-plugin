/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import { AbstractSession, ImperativeExpect, Logger } from "@zowe/imperative";
import { CicsCmciRestClient } from "../../rest";
import { CicsCmciConstants } from "../../constants";
import { ICMCIApiResponse, IProgramParms, ITransactionParms, IURIMapParms, IWebServiceParms } from "../../doc";

/**
 * Define a new program resource to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {IProgramParms} parms - parameters for defining your program
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS program name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function defineProgram(session: AbstractSession, parms: IProgramParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Program name", "CICS program name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

    Logger.getAppLogger().debug("Attempting to define a program with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = {
        request: {
            create: {
                parameter: {
                    $: {
                        name: "CSD",
                    }
                },
                attributes: {
                    $: {
                        name: parms.name,
                        csdgroup: parms.csdGroup
                    }
                }
            }
        }
    };

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_PROGRAM + "/" + cicsPlex + parms.regionName;
    return CicsCmciRestClient.postExpectParsedXml(session, cmciResource, [], requestBody) as any;
}

/**
 * Define a new transaction resource to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {ITransactionParms} parms - parameters for defining your transaction
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS transaction name not defined or blank
 * @throws {ImperativeError} CICS program name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function defineTransaction(session: AbstractSession, parms: ITransactionParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Transaction name", "CICS transaction name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.programName, "CICS Program name", "CICS program name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

    Logger.getAppLogger().debug("Attempting to define a transaction with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = {
        request: {
            create: {
                parameter: {
                    $: {
                        name: "CSD",
                    }
                },
                attributes: {
                    $: {
                        name: parms.name,
                        program: parms.programName,
                        csdgroup: parms.csdGroup
                    }
                }
            }
        }
    };

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_TRANSACTION + "/" + cicsPlex +
        parms.regionName;
    return CicsCmciRestClient.postExpectParsedXml(session, cmciResource,
        [], requestBody) as any;
}

/**
 * Define a new server URIMap resource to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {IURIMapParms} parms - parameters for defining your URIMap
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS URIMap name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS URIMap path not defined or blank
 * @throws {ImperativeError} CICS URIMap host not defined or blank
 * @throws {ImperativeError} CICS URIMap scheme not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CICS URIMap program name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function defineUrimapServer(session: AbstractSession, parms: IURIMapParms): Promise<ICMCIApiResponse> {
    validateUrimapParms(parms);
    ImperativeExpect.toBeDefinedAndNonBlank(parms.programName, "CICS URIMap Program name", "CICS URIMap program name is required");

    Logger.getAppLogger().debug("Attempting to define a server URIMap with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = buildUrimapRequestBody(parms, "server");
    requestBody.request.create.attributes.$.program = parms.programName;

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_URIMAP + "/" + cicsPlex + parms.regionName;
    return CicsCmciRestClient.postExpectParsedXml(session, cmciResource, [], requestBody) as any;
}

/**
 * Define a new client URIMap resource to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {IURIMapParms} parms - parameters for defining your URIMap
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS URIMap name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS URIMap path not defined or blank
 * @throws {ImperativeError} CICS URIMap host not defined or blank
 * @throws {ImperativeError} CICS URIMap scheme not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function defineUrimapClient(session: AbstractSession, parms: IURIMapParms): Promise<ICMCIApiResponse> {
    validateUrimapParms(parms);

    Logger.getAppLogger().debug("Attempting to define a client URIMap with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = buildUrimapRequestBody(parms, "client");

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_URIMAP + "/" + cicsPlex + parms.regionName;
    return CicsCmciRestClient.postExpectParsedXml(session, cmciResource, [], requestBody) as any;
}

/**
 * Define a new pipeline URIMap resource to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {IURIMapParms} parms - parameters for defining your URIMap
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS URIMap name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS URIMap path not defined or blank
 * @throws {ImperativeError} CICS URIMap host not defined or blank
 * @throws {ImperativeError} CICS URIMap scheme not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CICS URIMap pipeline name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function defineUrimapPipeline(session: AbstractSession, parms: IURIMapParms): Promise<ICMCIApiResponse> {
    validateUrimapParms(parms);
    ImperativeExpect.toBeDefinedAndNonBlank(parms.pipelineName, "CICS URIMap Pipeline name", "CICS URIMap pipeline name is required");

    Logger.getAppLogger().debug("Attempting to define a pipeline URIMap with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = buildUrimapRequestBody(parms, "pipeline");
    requestBody.request.create.attributes.$.pipeline = parms.pipelineName;

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_URIMAP + "/" + cicsPlex + parms.regionName;
    return CicsCmciRestClient.postExpectParsedXml(session, cmciResource, [], requestBody) as any;
}

/**
 * Validate parameters for defining a URIMap
 * @param {IURIMapParms} parms - parameters to validate
 * @throws {ImperativeError} CICS URIMap name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS URIMap path not defined or blank
 * @throws {ImperativeError} CICS URIMap host not defined or blank
 * @throws {ImperativeError} CICS URIMap scheme not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 */
function validateUrimapParms(parms: IURIMapParms) {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS URIMap Name", "CICS URIMap name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.path, "CICS URIMap Path", "CICS URIMap path is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.host, "CICS URIMap Host", "CICS URIMap host is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.scheme, "CICS URIMap Scheme", "CICS URIMap scheme is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");
}

/**
 * Build request body for defining a URIMap
 * @param {IURIMapParms} parms - parameters containing attribute values
 * @param {string} usage - value of the usage attribute (server, client, or pipeline)
 */
function buildUrimapRequestBody(parms: IURIMapParms, usage: "server" | "client" | "pipeline") {
    const requestAttrs: any = {
        name: parms.name,
        csdgroup: parms.csdGroup,
        path: parms.path,
        host: parms.host,
        scheme: parms.scheme,
        usage
    };

    if (parms.description != null) {
        requestAttrs.description = parms.description;
    }

    if (parms.transactionName != null) {
        requestAttrs.transaction = parms.transactionName;
    }

    if (parms.webserviceName != null) {
        requestAttrs.webservice = parms.webserviceName;
    }

    if (parms.enable === false) {
        requestAttrs.status = "DISABLED";
    } else {
        requestAttrs.status = "ENABLED";
    }

    return {
        request: {
            create: {
                parameter: {
                    $: {
                        name: "CSD",
                    }
                },
                attributes: {
                    $: requestAttrs
                }
            }
        }
    };
}

export async function defineWebservice(session: AbstractSession, parms: IWebServiceParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Web service name", "CICS web service name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.pipelineName, "CICS Pipeline name", "CICS pipeline name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.wsBind, "CICS Web service binding file", "CICS web service binding file is required");
    ImperativeExpect.toNotBeNullOrUndefined(parms.validation, "CICS web service validation is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

    Logger.getAppLogger().debug("Attempting to define a web service with the following parameters:\n%s", JSON.stringify(parms));
    const requestAttrs: any = {
        name: parms.name,
        csdgroup: parms.csdGroup,
        pipeline: parms.pipelineName,
        wsbind: parms.wsBind,
        validation: parms.validation ? "yes" : "no"
    };

    if (parms.description != null) {
        requestAttrs.description = parms.description;
    }

    if (parms.wsdlFile != null) {
        requestAttrs.wsdlFile = parms.wsdlFile;
    }

    const requestBody: any = {
        request: {
            create: {
                parameter: {
                    $: {
                        name: "CSD",
                    }
                },
                attributes: {
                    $: requestAttrs
                }
            }
        }
    };

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_WEBSERVICE + "/" + cicsPlex +
        parms.regionName;
    return CicsCmciRestClient.postExpectParsedXml(session, cmciResource,
        [], requestBody) as any;
}
