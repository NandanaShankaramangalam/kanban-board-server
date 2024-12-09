function convertToTaskStructure(
  data,
  statusKey = "status",
  idKey = "_id",
  taskIdKey = "taskId", 
  titleKey = "title",
  descriptionKey = "description", 
  
  assigneeIdKey = "assigneeId" 
) {
  const initialStatus = {
    to_do: { title: "to_do", items: [] },
    in_progress: { title: "in_progress", items: [] },
    done: { title: "done", items: [] },
  };

  return data.reduce((acc, item) => {
    const normalizedStatus = item[statusKey]
      ? item[statusKey].toLowerCase().trim().replace(/\s+/g, "_")
      : null;

    if (normalizedStatus && acc.hasOwnProperty(normalizedStatus)) {
      const id = item[idKey] || "unknown_id"; 
      const taskId = item[taskIdKey] || "unknown_task_id"; 
      const title = item[titleKey] || "Untitled Task"; 
      const description = item[descriptionKey] || ""; 
      const assigneeId = item[assigneeIdKey] || null; 

      acc[normalizedStatus].items.push({
        id, 
        taskId, 
        title, 
        description, 
        assigneeId, 
        status: normalizedStatus, 
      });
    }

    return acc;
  }, initialStatus); 
}

module.exports = { convertToTaskStructure };
