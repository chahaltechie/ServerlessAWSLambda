import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator';
import schema from "../lib/schemas/getAuctionSchema";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
    let auctions;
    try {
        const {status} = event.queryStringParameters;
        const params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            IndexName: 'statusAndEndDate',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues: {
                ':status': status
            },
            //ExpressionAttributeNames is used because status is a reserved keyword so to replace #status before query execution.
            ExpressionAttributeNames: {
                '#status': 'status'
            }
        };

        const result = await dynamoDb.query(params).promise();
        auctions = result.Items;
    } catch (e) {
        console.error(e);
        throw new createError.InternalServerError(e);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({auctions}),
    };
}

export const handler = commonMiddleware(getAuctions)
    .use(validator({
        inputSchema: schema,
        useDefaults: true
    }));


