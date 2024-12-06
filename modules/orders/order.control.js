const { number } = require("joi");
const Model = require("./order.model");
const create=(payload)=>{
    return Model.create(payload);
};
const getByOrderNumber=(orderNo)=>{
    return Model.findOne({number:orderNo})
};
const list = async ({ filter, search, page = 1, limit = 2 }) => {
    let currentPage = +page;
    currentPage = currentPage < 1 ? 1 : currentPage;
    const { number} = search;
  
    const query = [];
    if (filter?.status) {
      query.push({
        $match: {
          isBlocked: filter?.status,
        },
      });
    }
  
    if (number) {
      query.push({
        $match: {
          number: new RegExp(number, 'gi')
        }
      });
    }
  
    query.push(
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: (currentPage - 1) * +limit },
            { $limit: +limit }
          ]
        }
      },
      {
        $addFields: {
          total: { $arrayElemAt: ["$metadata.total", 0] }
        }
      },
      {
        $project: {
          metadata: 0
        }
      }
    );
  
    // Use aggregate for querying with the pipeline
    const result = await UserModel.aggregate(query);
  
    // Safely access data and total
    return {
      data: result[0]?.data || [],
      page: currentPage,
      limit: +limit,
      total: result[0]?.total || 0,
    };
  };
const updateOrder = (orderNo, payload)=>{
    return Model.findOneAndUpdate({number:orderNo}, payload, {new:true})
};
const updateOrderStatus=async(orderNo)=>{
    const order = await Model.findOne({number: orderNo});
    const payload={
        status: order?.status === "paid" ? "unpaid" :"paid",
    };
    return Model.findOneAndUpdate({number:orderNo}, payload,{new:true});
};
const removeOrder=(orderNo)=>{
    return Model.deleteOne({number:orderNo});
};

module.exports={create,getByOrderNumber,list,updateOrder,updateOrderStatus,removeOrder}