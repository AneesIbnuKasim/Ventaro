const { default: Order } = require("../models/Order")

class DashboardService {
    static async fetchSalesReport(query) {
        const { startDate, endDate, period } = query

        console.log('query in api server', query);
        
        const start = new Date()
        start.setDate(start.getDate()-365)
// createdAt: {$gte: new Date(startDate), $lte: new Date(endDate)}
        const report = await Order.aggregate([
            {$match: {orderStatus: "DELIVERED"}},
            {$facet: {
                Daily: [
                    {
                        $group: {_id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: '$createdAt'
                            }
                        },
                        totalSales: {$sum: '$totalAmount'},
                        orderCount: {$sum: 1}
                    },
                },
                {
                    $sort: {_id: 1}
                }
                ],

                Weekly: [
                    {
                        $group: {
                            _id: {
                                year: { $isoWeekYear: '$createdAt'},
                                week: { $isoWeek: '$createdAt'},
                            },
                            totalSales: { $sum: '$totalAmount'},
                            orderCount: {$sum: 1}
                        }
                    },
                    {$sort: {'_id.year': 1, '_id.week': 1}}
                ],
                Monthly: [
                    {
                        $group: {
                            _id: {
                                year: {$year: '$createdAt'},
                                month: {$month: '$createdAt'}
                            },
                            totalSales: {$sum: '$totalAmount'},
                            orderCount: {$sum: 1}
                        }
                    },
                    {$sort: {'_id.year':1, '_id.month': 1}}
                ],
                Yearly: [
                    {
                        $group: {
                            _id: {
                                year: {$year: '$createdAt'}
                            },
                            totalSales: {$sum: '$totalAmount'},
                            orderCount: {$sum: 1}
                        }
                    },
                    {$sort: {_id: 1}}
                ]
               
            }}
        ])

        console.log('salesReport', report);

        const salesReport = report[0]

        return salesReport
    }

    
}


module.exports = DashboardService