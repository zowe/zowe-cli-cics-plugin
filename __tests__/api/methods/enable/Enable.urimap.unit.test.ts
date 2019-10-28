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
    enableUrimap,
    IProgramParms,
    IURIMapParms,
} from "../../../../src";

describe("CMCI - enable urimap", () => {

    const urimap = "urimap";
    const region = "region";
    const csdgroup = "group";
    const content = "ThisIsATest";

    const enableParms: IURIMapParms = {
        regionName: region,
        name: urimap,
        csdGroup: csdgroup
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
            enableParms.regionName = region;
            enableParms.name = urimap;
            enableParms.csdGroup = csdgroup;
        });

        it("should throw an error if no region name is specified", async () => {
            enableParms.regionName = undefined;
            try {
                response = await enableUrimap(dummySession, enableParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw an error if no urimap name is specified", async () => {
            enableParms.name = undefined;
            try {
                response = await enableUrimap(dummySession, enableParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS URIMap name is required");
        });

        it("should throw an error if no csd group is specified", async () => {
            enableParms.csdGroup = undefined;
            try {
                response = await enableUrimap(dummySession, enableParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS CSD group name is required");
        });
    });

    describe("success scenarios", () => {
        const enableSpy = jest.spyOn(CicsCmciRestClient, "putExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            enableSpy.mockClear();
            enableSpy.mockImplementation(() => content);
            enableParms.regionName = region;
            enableParms.name = urimap;
            enableParms.csdGroup = csdgroup;
        });

        it("should be able to enable a urimap", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_DEFINITION_URIMAP + "/" + region +
            `?CRITERIA=(NAME=${enableParms.name})&PARAMETER=CSDGROUP(${enableParms.csdGroup})`;
            requestBody = {
                request: {
                    update: {
                        attributes: {
                            $: {
                                STATUS: "ENABLED"
                            }
                        }
                    }
                }
            };

            response = await enableUrimap(dummySession, enableParms);
            expect(response).toContain(content);
            expect(enableSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });
    });
});
