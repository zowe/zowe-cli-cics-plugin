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

import { AbstractSession, ImperativeExpect, Logger, Imperative } from "@zowe/imperative";
import { CicsCmciRestClient } from "../../rest";
import { CicsCmciConstants } from "../../constants";
import { ICMCIApiResponse, ICSDGroupParms } from "../../doc";

/**
 * Add a new CSD Group resource to a CSD List in CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {ICSDGroupParms} parms - parameters for defining your CSD Group
 * @returns {Promise<any>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS CSD Group name not defined or blank
 * @throws {ImperativeError} CICS CSD List not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function addCSDGroupToList(session: AbstractSession, parms: ICSDGroupParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS CSD Group Name", "CICS CSD Group Name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.csdList, "CICS CSD List", "CICS CSD List is required");

    Logger.getAppLogger().debug("Attempting to add a CSD Group to a CSD List with the following parameters:\n%s", JSON.stringify(parms));

    const requestAttrs: any = {
        ADD_CSDGROUP: parms.name,
        TO_CSDLIST: parms.csdList,
    };
    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    const cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        CicsCmciConstants.CICS_CSDGROUP + "/" + cicsPlex + parms.regionName +
        "?CRITERIA=NAME=='" + parms.name + "'";

    const requestBody: any = {
        request: {
            action: {
                $: {
                    name: "CSDADD",
                },
                parameter: {
                    $: {
                        name: "TO_CSDLIST",
                        value: parms.csdList
                    }
                }
            }
        }
    };
    return CicsCmciRestClient.putExpectParsedXml(session, cmciResource, [], requestBody) as any;
}
