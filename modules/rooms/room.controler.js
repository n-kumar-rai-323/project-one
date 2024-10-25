const Model = require("./room.model");

const create = (payload)=>{
    const {updateById, ...rest}=payload;
    rest.created_by = updateById;
    return Model.create(rest);
};
const publicRooms=()=>{
    return Model.find({status:"empty"});
};
const list = async ({ filter, search, page = 1, limit = 2 }) => {
    let currentPage = +page;
    currentPage = currentPage < 1 ? 1 : currentPage;
    const { name } = search;
  
    const query = [];
    if (filter?.status) {
      query.push({
        $match: {
          isBlocked: filter?.status,
        },
      });
    }
  
    if (name) {
      query.push({
        $match: {
          name: new RegExp(name, 'gi')
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

const getById = (id)=>{
    return Model.findOne({_id:id})
}
const publicRoomInfo= (number)=>{
    return Model.findOne({name:new RegExp(number, "gi"), status:"empty"});
}
const updateById=(id, payload)=>{
    return Model.findOneAndUpdate({_id:id}, payload, {new:true});
}
const updateStatus=(id, payload)=>{
    return Model.findOneAndUpdate({_id:id}, payload,{new:true});
}
const remove=async(number)=>{
    const room = await Model.findOne({name:new RegExp(number, "gi")});
    if(room.status !== "empty"){
        throw new Error("Room is not empty at the moment. Please empty the room before deleting");
    }
    return Model.deletOne({name:new RegExp(number, "gi")});
};



module.exports = {create,publicRooms,list,getById,publicRoomInfo,updateById,updateStatus,remove}