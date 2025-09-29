import createTransactions from "./createTransaction"

async function rewardUser(userid: number) {
    try {
        if (!userid) return { amount: 0 }
        const reward = 10
        await createTransactions(userid, reward, 'available', 'success', 'file_download')
        return { amount: reward }
    } catch (error) {
        throw error
    }
}

export default rewardUser