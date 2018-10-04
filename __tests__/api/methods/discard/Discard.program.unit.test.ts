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

import { Session } from "@brightside/imperative";
import { CicsCmciConstants, CicsCmciRestClient, discardProgram, IProgramParms } from "../../../../src";

describe("CMCI - Discard program", () => {

    const program = "program";
    const region = "region";
    const cicsPlex = "plex";
    const content = "This\nis\r\na\ntest";

    const discardParms: IProgramParms = {
        regionName: region,
        name: program,
        cicsPlex: undefined
    };

    const dummySession = new Session({
        user: "fake",
        password: "fake",
        hostname: "fake",
        port: 1490
    });

    let error: any;
    let response: any;
    let endPoint: string;

    describe("validation", () => {
        beforeEach(() => {
            response = undefined;
            error = undefined;
        });

        it("should throw error if no parms are defined", async () => {
            try {
                response = await discardProgram(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Cannot read property 'name' of undefined");
        });

        it("should throw error if program name is not defined", async () => {
            try {
                response = await discardProgram(dummySession, {
                    regionName: "fake",
                    name: undefined,
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS program name is required");
        });

        it("should throw error if CICS Region name is not defined", async () => {
            try {
                response = await discardProgram(dummySession, {
                    regionName: undefined,
                    name: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw error if program name is missing", async () => {
            try {
                response = await discardProgram(dummySession, {
                    regionName: "fake",
                    name: ""
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Program name' must not be blank");
        });

        it("should throw error if CICS Region name is missing", async () => {
            try {
                response = await discardProgram(dummySession, {
                    regionName: "",
                    name: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Region name' must not be blank");
        });
    });

    describe("success scenarios", () => {

        const discardSpy = jest.spyOn(CicsCmciRestClient, "deleteExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            discardSpy.mockClear();
            discardSpy.mockImplementation(() => content);
        });

        it("should be able to discard a program without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_PROGRAM_RESOURCE + "/" + region +
                "?CRITERIA=(PROGRAM=" + discardParms.name + ")";

            response = await discardProgram(dummySession, discardParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(discardSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to discard a program with cicsPlex specified but empty string", async () => {
            discardParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_PROGRAM_RESOURCE + "//" + region +
                "?CRITERIA=(PROGRAM=" + discardParms.name + ")";

            response = await discardProgram(dummySession, discardParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(discardSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to discard a program with cicsPlex specified", async () => {
            discardParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_PROGRAM_RESOURCE + "/" + cicsPlex + "/" + region +
                "?CRITERIA=(PROGRAM=" + discardParms.name + ")";

            response = await discardProgram(dummySession, discardParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(discardSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });
    });
});
