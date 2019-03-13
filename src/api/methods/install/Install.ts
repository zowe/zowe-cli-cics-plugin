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
import { ICMCIApiResponse, IProgramParms } from "../../doc";

/**
 * Install a program definition to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {IProgramParms} parms - parameters for installing your program
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS program name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function installProgram(session: AbstractSession, parms: IProgramParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Program name", "CICS program name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

    Logger.getAppLogger().debug("Attempting to install a program with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = {
        request: {
            action: {
                $: {
                    name: "CSDINSTALL",
                }
            }
        }
    };

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_PROGRAM + "/" + cicsPlex + parms.regionName +
        "?CRITERIA=(NAME=" + parms.name + ")&PARAMETER=CSDGROUP(" + parms.csdGroup + ")";
    return CicsCmciRestClient.putExpectParsedXml(session, cmciResource, [], requestBody) as any;
}

/**
 * Install a transaction definition to CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {IProgramParms} parms - parameters for installing your transaction
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS transaction name not defined or blank
 * @throws {ImperativeError} CICS CSD group not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function installTransaction(session: AbstractSession, parms: IProgramParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Transaction name", "CICS transaction name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdGroup, "CICS CSD Group", "CICS CSD group is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

    Logger.getAppLogger().debug("Attempting to install a transaction with the following parameters:\n%s", JSON.stringify(parms));
    const requestBody: any = {
        request: {
            action: {
                $: {
                    name: "CSDINSTALL",
                }
            }
        }
    };

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_DEFINITION_TRANSACTION + "/" + cicsPlex + parms.regionName +
        "?CRITERIA=(NAME=" + parms.name + ")&PARAMETER=CSDGROUP(" + parms.csdGroup + ")";
    return CicsCmciRestClient.putExpectParsedXml(session, cmciResource,
        [], requestBody) as any;
}
