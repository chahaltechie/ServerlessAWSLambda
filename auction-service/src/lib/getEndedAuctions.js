import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
    const now=new Date();
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endingAt <= :endingAt',
        ExpressionAttributeValues:{
            ':status': 'OPEN',
            ':endingAt': now.toISOString()
        },
        //ExpressionAttributeNames is used because status is a reserved keyword so to replace #status before query execution.
        ExpressionAttributeNames:{
            '#status': 'status'
        }
    };
    
    const result = await dynamoDb.query(params).promise();
    return result.Items;
}