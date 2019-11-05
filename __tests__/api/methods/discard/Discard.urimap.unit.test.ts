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
    discardUrimap,
    IProgramParms,
    IURIMapParms,
} from "../../../../src";

describe("CMCI - Discard urimap", () => {

    const urimap = "urimap";
    const region = "region";
    const content = "ThisIsATest";

    const discardParms: IURIMapParms = {
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

    describe("validation", () => {
        beforeEach(() => {
            response = undefined;
            error = undefined;
            discardParms.regionName = region;
            discardParms.name = urimap;
        });

        it("should throw an error if no region name is specified", async () => {
            discardParms.regionName = undefined;
            try {
                response = await discardUrimap(dummySession, discardParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw an error if no urimap name is specified", async () => {
            discardParms.name = undefined;
            try {
                response = await discardUrimap(dummySession, discardParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS URIMap name is required");
        });
    });

    describe("success scenarios", () => {
        const discardSpy = jest.spyOn(CicsCmciRestClient, "deleteExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            discardSpy.mockClear();
            discardSpy.mockImplementation(() => content);
            discardParms.regionName = region;
            discardParms.name = urimap;
        });

        it("should be able to discard a urimap", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_URIMAP + "/" + region +
            `?CRITERIA=(NAME='${discardParms.name}')`;

            response = await discardUrimap(dummySession, discardParms);
            expect(response).toContain(content);
            expect(discardSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });
    });
});
