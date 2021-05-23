import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS()
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

    await dynamoDb.update(param).promise();
    const notifySeller = sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject: `your auction named ${auction.title} has ended.`,
            recipient: auction.seller,
            body: `your auction named ${auction.title} has ended and the highest bidder is ${auction.highestBid.bidder}`
        })
    })
}