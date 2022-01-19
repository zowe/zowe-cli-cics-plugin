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
import { CicsCmciRestClient, CicsCmciConstants, IWebServiceParms, defineWebservice } from "../../../../src";

describe("CMCI - Define web service", () => {

    const websvc = "websvc";
    const group = "group";
    const pipeline = "pipeline";
    const wsBind = "wsbind";
    const region = "region";
    const cicsPlex = "plex";
    const content = "This\nis\r\na\ntest";

    const defineParms: IWebServiceParms  = {
        name: websvc,
        pipelineName: pipeline,
        wsBind,
        validation: false,
        regionName: region,
        csdGroup: group,
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
                response = await defineWebservice(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toMatch(/(cannot read).*undefined/ig);
        });

        it("should throw error if web service name is not defined", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: undefined,
                    csdGroup: "fake",
                    pipelineName: "fake",
                    wsBind: "fake",
                    validation: false,
                    regionName: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS web service name is required");
        });

        it("should throw error if CSD group is not defined", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "fake",
                    csdGroup: undefined,
                    pipelineName: "fake",
                    wsBind: "fake",
                    validation: false,
                    regionName: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS CSD group is required");
        });

        it("should throw error if web service pipeline name is not defined", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "fake",
                    csdGroup: "fake",
                    pipelineName: undefined,
                    wsBind: "fake",
                    validation: false,
                    regionName: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS pipeline name is required");
        });

        it("should throw error if web service binding file is not defined", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "fake",
                    csdGroup: "fake",
                    pipelineName: "fake",
                    wsBind: undefined,
                    validation: false,
                    regionName: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS web service binding file is required");
        });

        it("should throw error if web service validation is not defined", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "fake",
                    csdGroup: "fake",
                    pipelineName: "fake",
                    wsBind: "fake",
                    validation: undefined,
                    regionName: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS web service validation is required");
        });

        it("should throw error if CICS Region name is not defined", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "fake",
                    csdGroup: "fake",
                    pipelineName: "fake",
                    wsBind: "fake",
                    validation: false,
                    regionName: undefined
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw error if web service name is missing", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "",
                    csdGroup: "fake",
                    pipelineName: "fake",
                    wsBind: "fake",
                    validation: false,
                    regionName: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Web service name' must not be blank");
        });

        it("should throw error if CSD group is missing", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "fake",
                    csdGroup: "",
                    pipelineName: "fake",
                    wsBind: "fake",
                    validation: false,
                    regionName: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS CSD Group' must not be blank");
        });

        it("should throw error if web service pipeline name is missing", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "fake",
                    csdGroup: "fake",
                    pipelineName: "",
                    wsBind: "fake",
                    validation: false,
                    regionName: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Pipeline name' must not be blank");
        });

        it("should throw error if web service binding file is missing", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "fake",
                    csdGroup: "fake",
                    pipelineName: "fake",
                    wsBind: "",
                    validation: false,
                    regionName: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Web service binding file' must not be blank");
        });

        it("should throw error if CICS Region name is missing", async () => {
            try {
                response = await defineWebservice(dummySession, {
                    name: "fake",
                    csdGroup: "fake",
                    pipelineName: "fake",
                    wsBind: "fake",
                    validation: false,
                    regionName: ""
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
                            name: websvc,
                            csdgroup: group,
                            pipeline,
                            wsbind: wsBind,
                            validation: "no"
                        }
                    }
                }
            }
        };

        const defineSpy = jest.spyOn(CicsCmciRestClient, "postExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            defineSpy.mockClear();
            defineSpy.mockImplementation(() => content);
        });

        it("should be able to define a web service without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_WEBSERVICE + "/" + region;

            response = await defineWebservice(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to define a web service with cicsPlex specified but empty string", async () => {
            defineParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_WEBSERVICE + "//" + region;

            response = await defineWebservice(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to define a web service with cicsPlex specified", async () => {
            defineParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_WEBSERVICE + "/" + cicsPlex +"/" + region;

            response = await defineWebservice(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });
    });
});
