# Amazon Connect Cases Auto Close

## Introduction

Amazon Connect Cases, a feature of Amazon Connect, allows your agents to track and manage customer issues that require multiple interactions, follow-up tasks, and teams in your contact center. A contact center needs the capability to auto close a case if a customer does not respond to a case within a certain time frame, such as three days. For example, a customer service case in the “Resolved” state can be closed automatically if the customer does not take any action. In this solution, you will learn how to set up an auto close mechanism for Amazon Connect Cases.

## Prerequisites
It is assumed that you understand the use of the services below and you have the following prerequisites:
1.  An AWS account with both management console and programmatic administrator access.
2.  An existing Amazon Connect instance.
3.  Amazon Connect Customer Profiles enabled on Connect Instance.
4.  Amazon Connect Cases enabled on Connect Instance.

## Architecture diagram 

![Architecture Diagram](images/architecture-cases-auto-close.png?raw=true)

In the above architecture, when an Amazon Connect Case is created, it fires a Case event through Amazon EventBridge, which provides you with near real-time updates when cases are created or modified within your Amazon Connect Cases domain. Amazon SQS processes this event. AWS lambda pics this event from the Amazon SQS and adds a record in the Amazon DynamoDB for tracking the case’s status. A separate AWS lambda runs on a nightly cron job to scan the Cases record in the Amazon DynamoDB table for reaching the threshold to be marked as closed. This AWS Lambda function calls the Amazon Connect Cases API to update the status of such Cases as closed, followed by updating the case status in the DynamoDB table. 



## Walkthrough

1.	Download the zip file code for this repository [here](zip/amazon-connect-cases-auto-close.zip).
2.	Create a S3 solution bucket in your AWS account.
3.	Place the Zip file downloaded in step 1
5.	Run the CFT located [here](cft/amazon-connect-cases-auto-close.yaml).
6.	Following parameters needed for the CFT:
    1.	CasesAutoCloseDays: Case auto close after X day of creation
    2.	CasesDomainId: Copy the case domain ID from the Amazon Connect instance
    3.	SolutionSourceBucket: Solution bucket created in step 3

![CloudFormation Template Screenshot](images/cft-screenshot.png?raw=true)

## Validate
1.	Create or update your cases using by placing test call or using the Agent workspace
2.	You will see the cases event in the Amazon DynamoDB table
3.	After a X day (Step 5.1 in the walkthrough) the Amazon Connect cases status will be updated as closed and makerd as close in the DynamoDB table for tracking. 

## Conclusion
In this guide, you learned how to stream Amazon Connect Cases to store the Case records in the Amazon DynamoDB table and auto update the Case status to close after the pre-defined configurable days.
