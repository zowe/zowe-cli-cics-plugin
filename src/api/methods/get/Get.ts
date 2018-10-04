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

import { AbstractSession, ImperativeExpect, Logger } from "@brightside/imperative";
import { CicsCmciRestClient } from "../../rest";
import { CicsCmciConstants } from "../../constants";
import { ICMCIApiResponse, IResourceParms } from "../../doc";

/**
 * Get resources on in CICS through CMCI REST API
 * @param {AbstractSession} session - the session to connect to CMCI with
 * @param {IResourceParms} parms - parameters for getting resources
 * @returns {Promise<ICMCIApiResponse>} promise that resolves to the response (XML parsed into a javascript object)
 *                          when the request is complete
 * @throws {ImperativeError} CICS resource name not defined or blank
 * @throws {ImperativeError} CICS region name not defined or blank
 * @throws {ImperativeError} CicsCmciRestClient request fails
 */
export async function getResource(session: AbstractSession, parms: IResourceParms): Promise<ICMCIApiResponse> {
    ImperativeExpect.toBeDefinedAndNonBlank(parms.name, "CICS Resource name", "CICS resource name is required");
    ImperativeExpect.toBeDefinedAndNonBlank(parms.regionName, "CICS Region name", "CICS region name is required");

    let delimiter = "?"; // initial delimiter

    Logger.getAppLogger().debug("Attempting to get resource(s) with the following parameters:\n%s", JSON.stringify(parms));

    const cicsPlex = parms.cicsPlex == null ? "" : parms.cicsPlex + "/";
    let cmciResource = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
        parms.name + "/" + cicsPlex + parms.regionName;

    if (parms.criteria != null) {
        cmciResource = cmciResource + delimiter + "CRITERIA=(" + encodeURIComponent(parms.criteria) + ")";
        delimiter = "&";
    }

    if (parms.parameter != null) {
        cmciResource = cmciResource + delimiter + "PARAMETER=" + encodeURIComponent(parms.parameter);
    }
    return CicsCmciRestClient.getExpectParsedXml(session, cmciResource, []);
}
