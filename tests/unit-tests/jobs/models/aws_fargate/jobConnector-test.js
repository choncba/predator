'use strict';
const should = require('should');
const sinon = require('sinon');
const { ECSClient, RunTaskCommand, ListTasksCommand, DescribeTasksCommand, StopTaskCommand } = require('@aws-sdk/client-ecs');

// We stub the ECSClient.prototype.send method
const jobConnector = require('../../../../../src/jobs/models/aws_fargate/jobConnector');

describe('aws fargate job connector tests', function () {
    let sandbox, sendStub;

    const farGateJobConfig = {
        hello: 'fargate'
    };

    before(() => {
        sandbox = sinon.createSandbox();
        sendStub = sandbox.stub(ECSClient.prototype, 'send');
    });

    after(() => {
        sandbox.restore();
    });

    afterEach(() => {
        sandbox.resetHistory();
    });

    describe('Run new job', () => {
        it('Success to create a job and running it immediately', async () => {
            sendStub.resolves({});

            await jobConnector.runJob(farGateJobConfig, { tag: 'eu-west-1' });

            should(sendStub.callCount).eql(1);
            const command = sendStub.args[0][0];
            should(command).be.instanceOf(RunTaskCommand);
            should(command.input).eql(farGateJobConfig);
        });

        it('Fail to run job', async () => {
            sendStub.rejects(new Error('failure'));
            try {
                await jobConnector.runJob(farGateJobConfig, { tag: 'eu-west-1' });
                throw new Error('should not get here');
            } catch (error) {
                should(error.message).eql('failure');
            }
        });
    });

    describe('Stop running job which is found', () => {
        it('Stop a running run of specific job', async () => {
            sendStub.onFirstCall().resolves({ taskArns: ['1', '2', '3'] });
            sendStub.onSecondCall().resolves({
                tasks: [
                    { taskArn: 1, tags: [{ key: 'job_identifier', value: 'jobPlatformName' }] },
                    { taskArn: 2, tags: [{ key: 'job_identifier', value: 'jobPlatformName' }] }
                ]
            });
            sendStub.onThirdCall().resolves({});
            sendStub.resolves({});

            await jobConnector.stopRun('jobPlatformName', { tag: 'eu-west-1' });

            // First call: ListTasksCommand
            should(sendStub.args[0][0]).be.instanceOf(ListTasksCommand);
            // Second call: DescribeTasksCommand
            should(sendStub.args[1][0]).be.instanceOf(DescribeTasksCommand);
            // Third and fourth calls: StopTaskCommand
            should(sendStub.args[2][0]).be.instanceOf(StopTaskCommand);
            should(sendStub.args[2][0].input).eql({ task: 1 });
            should(sendStub.args[3][0]).be.instanceOf(StopTaskCommand);
            should(sendStub.args[3][0].input).eql({ task: 2 });
        });

        it('No running jobs found', async () => {
            sendStub.resolves({ taskArns: [] });

            await jobConnector.stopRun('jobPlatformName', { tag: 'eu-west-1' });

            // Only ListTasksCommand should be called
            should(sendStub.callCount).eql(1);
            should(sendStub.args[0][0]).be.instanceOf(ListTasksCommand);
        });

        it('No running jobs found with matched jobPlatform identifier', async () => {
            sendStub.onFirstCall().resolves({ taskArns: ['1', '2', '3'] });
            sendStub.onSecondCall().resolves({
                tasks: [
                    { taskArn: 1, tags: [{ key: 'job_identifier', value: 'notMatched' }] },
                    { taskArn: 2, tags: [{ key: 'job_identifier', value: 'notMatched' }] }
                ]
            });

            await jobConnector.stopRun('jobPlatformName', { tag: 'eu-west-1' });

            // Only ListTasks + DescribeTasks, no StopTask
            should(sendStub.callCount).eql(2);
        });

        it('Failure Stopping a running run of specific job', async () => {
            sendStub.rejects(new Error('failure'));

            try {
                await jobConnector.stopRun('jobPlatformName', { tag: 'eu-west-1' });
                throw new Error('should not get here');
            } catch (error) {
                should(error.message).eql('failure');
            }
        });

        it('getLogs not implemented', async () => {
            try {
                await jobConnector.getLogs();
                throw new Error('should not get here');
            } catch (error) {
                should(error.message).eql('Not implemented');
            }
        });

        it('deleteAllContainers not implemented', async () => {
            try {
                await jobConnector.deleteAllContainers();
                throw new Error('should not get here');
            } catch (error) {
                should(error.message).eql('Not implemented');
            }
        });
    });
});
