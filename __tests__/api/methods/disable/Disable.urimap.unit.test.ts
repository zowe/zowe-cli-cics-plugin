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
    disableUrimap,
    IURIMapParms,
} from "../../../../src";

describe("CMCI - Disable urimap", () => {

    const urimap = "urimap";
    const region = "region";
    const content = "ThisIsATest";

    const disableParms: IURIMapParms = {
        regionName: region,
        name: urimap
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
            disableParms.regionName = region;
            disableParms.name = urimap;
        });

        it("should throw an error if no region name is specified", async () => {
            disableParms.regionName = undefined;
            try {
                response = await disableUrimap(dummySession, disableParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw an error if no urimap name is specified", async () => {
            disableParms.name = undefined;
            try {
                response = await disableUrimap(dummySession, disableParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS URIMap name is required");
        });
    });

    describe("success scenarios", () => {
        const disableSpy = jest.spyOn(CicsCmciRestClient, "putExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            disableSpy.mockClear();
            disableSpy.mockImplementation(() => content);
            disableParms.regionName = region;
            disableParms.name = urimap;
        });

        it("should be able to disable a urimap", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_URIMAP + "/" + region +
            `?CRITERIA=(NAME=${disableParms.name})`;
            requestBody = {
                request: {
                    update: {
                        attributes: {
                            $: {
                                ENABLESTATUS: "DISABLED"
                            }
                        }
                    }
                }
            };

            response = await disableUrimap(dummySession, disableParms);
            expect(response).toContain(content);
            expect(disableSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });
    });
});
