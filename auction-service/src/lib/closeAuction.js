import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
export async function closeAuction(auction)
{
    const param = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id: auction.id},
        UpdateExpression: 'set  #status=:status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED'
        },
        ExpressionAttributeNames:{
            '#status': 'status'
        },
        ReturnValues: "ALL_NEW"
    };

    return await dynamoDb.update(param).promise();
}