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

import { Session } from "@zowe/imperative";
import {
    CicsCmciConstants,
    CicsCmciRestClient,
    ICMCIApiResponse,
    installUrimap,
    IURIMapParms,
} from "../../../../src";

describe("CMCI - Install urimap", () => {

    const urimap = "urimap";
    const region = "region";
    const group = "group";
    const content = "ThisIsATest" as unknown as ICMCIApiResponse;

    const installParms: IURIMapParms = {
        regionName: region,
        name: urimap,
        csdGroup: group
    };

    const dummySession = new Session({
        user: "fake",
        password: "fake",
        hostname: "fake",
        port: 1490
    });

    let error: any;
    let response: any;
    let endPoint: any;
    let requestBody: any;

    describe("validation", () => {
        beforeEach(() => {
            response = undefined;
            error = undefined;
            installParms.regionName = region;
            installParms.name = urimap;
            installParms.csdGroup = group;
        });

        it("should throw an error if no region name is specified", async () => {
            installParms.regionName = undefined;
            try {
                response = await installUrimap(dummySession, installParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw an error if no urimap name is specified", async () => {
            installParms.name = undefined;
            try {
                response = await installUrimap(dummySession, installParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS URIMap name is required");
        });

        it("should throw an error if no csdGroup name is specified", async () => {
            installParms.csdGroup = undefined;
            try {
                response = await installUrimap(dummySession, installParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS CSD group name is required");
        });
    });

    describe("success scenarios", () => {
        const installSpy = jest.spyOn(CicsCmciRestClient, "putExpectParsedXml").mockResolvedValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            installSpy.mockClear();
            installSpy.mockResolvedValue(content);
            installParms.regionName = region;
            installParms.name = urimap;
            installParms.csdGroup = group;
        });

        it("should be able to install a urimap", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_DEFINITION_URIMAP + "/" + region +
            `?CRITERIA=(NAME=${installParms.name})&PARAMETER=CSDGROUP(${installParms.csdGroup})`;
            requestBody = {
                request: {
                    action: {
                        $: {
                            name: "CSDINSTALL",
                        }
                    }
                }
            };

            response = await installUrimap(dummySession, installParms);
            expect(response).toContain(content);
            expect(installSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });
    });
});
