import Database from "../db/mongodb";
const db = new Database();

type status = 'pending' | 'success'
type to = 'available' | 'pending' | 'locked' | 'none'
type type = 'withdraw' | 'views_reward' | 'referral' | 'refund' | 'adminDeposit' | 'file_download'

const ALLOWED_TO_VALUES: to[] = ['available', 'pending', 'locked', 'none'];

async function createTransactions(userid: number, amount: number, to: to, status: status = 'success', type: type = 'views_reward', additionalInfo = {}) {

    if (!ALLOWED_TO_VALUES.includes(to)) {
        throw new Error(`Invalid 'to' parameter. Must be one of: ${ALLOWED_TO_VALUES.join(', ')}`);
    }

    if (typeof amount !== 'number') {
        throw new Error("Invalid 'amount' parameter. Must be a number.");
    }

    try {
        const transactionId = crypto.randomUUID();
        const data = {
            userid,
            transactionId,
            amount,
            to,
            status: status,
            type: type,
            createdAt: new Date().getTime(),
            ...additionalInfo
        };

        if (to != 'none') {
            const updateQuery = { userid };
            const walletField = `wallet.${to}`;
            const updateData = { $inc: { [walletField]: amount } };

            const result = await (await db.collection('users')).updateOne(updateQuery, updateData)

            if (!result || result.matchedCount <= 0) {
                const newUser = {
                    userid: userid,
                    tgUsername: (additionalInfo as any)?.username,
                    createdAt: new Date().getTime(),
                    wallet: {
                        available: 0,
                        pending: 0
                    },
                }

                const userWithWallet = {
                    ...newUser,
                    wallet: {
                        ...newUser.wallet,
                        [to]: amount
                    }
                };
                await db.addLogs(userWithWallet, 'users')
            }
            await db.addLogs(data, 'transactions');
        }

        return { success: true, transaction: data }
    } catch (error: any) {
        console.log(error)
        throw new Error(`Error creating transaction: ${error.message}`);
    }
}

export default createTransactions;