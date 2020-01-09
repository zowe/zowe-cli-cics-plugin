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

import { CommandProfiles, IHandlerParameters, IProfile, Session } from "@zowe/imperative";
import { ICMCIApiResponse } from "../../../../src";
import { UrimapPipelineDefinition } from "../../../../src/cli/define/urimap-pipeline/UrimapPipeline.definition";
import UrimapPipelineHandler from "../../../../src/cli/define/urimap-pipeline/UrimapPipeline.handler";

jest.mock("../../../../src/api/methods/define");
const Define = require("../../../../src/api/methods/define");

const host = "somewhere.com";
const port = "43443";
const user = "someone";
const password = "somesecret";
const protocol = "http";
const rejectUnauthorized = false;

const PROFILE_MAP = new Map<string, IProfile[]>();
PROFILE_MAP.set(
    "cics", [{
        name: "cics",
        type: "cics",
        host,
        port,
        user,
        password
    }]
);
const PROFILES: CommandProfiles = new CommandProfiles(PROFILE_MAP);
const DEFAULT_PARAMETERS: IHandlerParameters = {
    arguments: {$0: "", _: []}, // Please provide arguments later on
    response: {
        data: {
            setMessage: jest.fn((setMsgArgs) => {
                expect(setMsgArgs).toMatchSnapshot();
            }),
            setObj: jest.fn((setObjArgs) => {
                expect(setObjArgs).toMatchSnapshot();
            }),
            setExitCode: jest.fn()
        },
        console: {
            log: jest.fn((logs) => {
                expect(logs.toString()).toMatchSnapshot();
            }),
            error: jest.fn((errors) => {
                expect(errors.toString()).toMatchSnapshot();
            }),
            errorHeader: jest.fn(() => undefined)
        },
        progress: {
            startBar: jest.fn((parms) => undefined),
            endBar: jest.fn(() => undefined)
        },
        format: {
            output: jest.fn((parms) => {
                expect(parms).toMatchSnapshot();
            })
        }
    },
    definition: UrimapPipelineDefinition,
    fullDefinition: UrimapPipelineDefinition,
    profiles: PROFILES
};

describe("DefineUrimapPipelineHandler", () => {
    const pipelineName = "testPipeline";
    const regionName = "testRegion";
    const csdGroup = "testGroup";
    const urimapName = "testUrimap";
    const urimapHost = "testHost";
    const urimapPath = "testPath";
    const urimapScheme = "http";
    const cicsPlex = "testPlex";
    const description = "description";
    const transactionName = "testTransaction";
    const webserviceName = "testWebservice";
    const enable = false;
    const tcpipservice = "TCPIPSRV";

    const defaultReturn: ICMCIApiResponse = {
        response: {
            resultsummary: {api_response1: "1024", api_response2: "0", recordcount: "0", displayed_recordcount: "0"},
            records: "testing"
        }
    };

    const functionSpy = jest.spyOn(Define, "defineUrimapPipeline");

    beforeEach(() => {
        functionSpy.mockClear();
        functionSpy.mockImplementation(async () => defaultReturn);
    });

    it("should call the defineUrimapPipeline api with required options specified", async () => {
        const handler = new UrimapPipelineHandler();

        const commandParameters = {...DEFAULT_PARAMETERS};
        commandParameters.arguments = {
            ...commandParameters.arguments,
            urimapName,
            csdGroup,
            urimapPath,
            urimapHost,
            pipelineName,
            urimapScheme,
            regionName,
            cicsPlex,
            enable,
            host,
            port,
            user,
            password,
            rejectUnauthorized,
            protocol
        };

        await handler.process(commandParameters);

        expect(functionSpy).toHaveBeenCalledTimes(1);
        const testProfile = PROFILE_MAP.get("cics")[0];
        expect(functionSpy).toHaveBeenCalledWith(
            new Session({
                type: "basic",
                hostname: testProfile.host,
                port: testProfile.port,
                user: testProfile.user,
                password: testProfile.password,
                rejectUnauthorized,
                protocol
            }),
            {
                name: urimapName,
                csdGroup,
                path: urimapPath,
                host: urimapHost,
                pipelineName,
                scheme: urimapScheme,
                regionName,
                cicsPlex,
                enable,
                description: undefined,
                transactionName: undefined,
                webserviceName: undefined
            }
        );
    });

    it("should call the defineUrimapPipeline api with all options specified", async () => {
        const handler = new UrimapPipelineHandler();

        const commandParameters = {...DEFAULT_PARAMETERS};
        commandParameters.arguments = {
            ...commandParameters.arguments,
            urimapName,
            csdGroup,
            urimapPath,
            urimapHost,
            pipelineName,
            urimapScheme,
            description,
            transactionName,
            webserviceName,
            tcpipservice,
            regionName,
            cicsPlex,
            host,
            port,
            user,
            password,
            rejectUnauthorized,
            protocol
        };

        await handler.process(commandParameters);

        expect(functionSpy).toHaveBeenCalledTimes(1);
        const testProfile = PROFILE_MAP.get("cics")[0];
        expect(functionSpy).toHaveBeenCalledWith(
            new Session({
                type: "basic",
                hostname: testProfile.host,
                port: testProfile.port,
                user: testProfile.user,
                password: testProfile.password,
                rejectUnauthorized,
                protocol
            }),
            {
                name: urimapName,
                csdGroup,
                path: urimapPath,
                host: urimapHost,
                pipelineName,
                scheme: urimapScheme,
                description,
                tcpipservice,
                transactionName,
                webserviceName,
                regionName,
                cicsPlex
            }
        );
    });
});
