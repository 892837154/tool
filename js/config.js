const memuList = [
    {"name": "首页", "toolShow": false},
    {"name": "记事本"},
    {
        "name": "热量计算器", "data_key": "heatList",
        "queryListKey": "food_name,calorie,protein,fat,carbohydrate,sugar,dietary_fiber,sodium",//查询结果字段
        "pageFields": [
            {"data_key": "food_name", "name": "食物名称"},
            {"data_key": "calorie", "name": "热量", "unit": "千卡"},
            {"data_key": "protein", "name": "蛋白质", "unit": "克"},
            {"data_key": "fat", "name": "脂肪", "unit": "克"},
            {"data_key": "dha", "name": "-DHA", "unit": "", "fold": true},
            {"data_key": "saturated_fat", "name": "-饱和脂肪", "unit": "克", "fold": true},
            {"data_key": "trans_fat", "name": "-反式脂肪", "unit": "克", "fold": true},
            {"data_key": "monounsaturated", "name": "-单不饱和脂肪", "unit": "克", "fold": true},
            {"data_key": "polyunsaturated", "name": "-多不饱和脂肪", "unit": "克", "fold": true},
            {"data_key": "cholesterol", "name": "胆固醇", "unit": "毫克", "fold": true},
            {"data_key": "carbohydrate", "name": "碳水化合物", "unit": "克"},
            {"data_key": "sugar", "name": "糖", "unit": "克"},
            {"data_key": "dietary_fiber", "name": "膳食纤维", "unit": "克"},
            {"data_key": "sodium", "name": "钠", "unit": "毫克"},
            {"data_key": "alcohol_by_volume", "name": "酒精度", "unit": "%vol", "fold": true},
            {"data_key": "purine", "name": "嘌呤", "unit": "毫克", "fold": true},
            {"data_key": "ash_content", "name": "灰分", "unit": "", "fold": true},
            {"data_key": "gi", "name": "GI", "unit": "", "fold": true},
            {"data_key": "gl", "name": "GL", "unit": "", "fold": true},
            {field_type: "10", "name": "维生素", "fold_name": "vitamins", "fold": true},
            {"data_key": "vitamin_a", "name": "维生素A", "unit": "IU", "fold": true},
            {"data_key": "carotene", "name": "胡萝卜素", "unit": "微克", "fold": true},
            {"data_key": "vitamin_d", "name": "维生素D", "unit": "微克", "fold": true},
            {"data_key": "vitamin_e", "name": "维生素E", "unit": "毫克", "fold": true},
            {"data_key": "vitamin_k", "name": "维生素K", "unit": "微克", "fold": true},
            {"data_key": "vitamin_b1", "name": "维生素B1", "unit": "毫克", "fold": true},
            {"data_key": "vitamin_b2", "name": "维生素B2", "unit": "毫克", "fold": true},
            {"data_key": "vitamin_b6", "name": "维生素B6", "unit": "毫克", "fold": true},
            {"data_key": "vitamin_b12", "name": "维生素B12", "unit": "微克", "fold": true},
            {"data_key": "vitamin_c", "name": "维生素C", "unit": "毫克", "fold": true},
            {"data_key": "niacin", "name": "烟酸", "unit": "微克", "fold": true},
            {"data_key": "folic_acid", "name": "叶酸", "unit": "微克", "fold": true},
            {"data_key": "pantothenic_acid", "name": "泛酸", "unit": "毫克", "fold": true},
            {"data_key": "biotin", "name": "生物素", "unit": "微克", "fold": true},
            {"data_key": "choline", "name": "胆碱", "unit": "毫克", "fold": true},
            {"data_key": "retinol_equivalent", "name": "视黄醇当量", "unit": "", "fold": true},
            {field_type: "10", "name": "矿物质", "fold_name": "minerals", "fold": true},
            {"data_key": "phosphorus", "name": "磷", "unit": "毫克", "fold": true},
            {"data_key": "potassium", "name": "钾", "unit": "毫克", "fold": true},
            {"data_key": "magnesium", "name": "镁", "unit": "毫克", "fold": true},
            {"data_key": "calcium", "name": "钙", "unit": "毫克", "fold": true},
            {"data_key": "iron", "name": "铁", "unit": "毫克", "fold": true},
            {"data_key": "zinc", "name": "锌", "unit": "毫克", "fold": true},
            {"data_key": "iodine", "name": "碘", "unit": "微克", "fold": true},
            {"data_key": "selenium", "name": "硒", "unit": "微克", "fold": true},
            {"data_key": "copper", "name": "铜", "unit": "毫克", "fold": true},
            {"data_key": "fluorine", "name": "氟", "unit": "毫克", "fold": true},
            {"data_key": "manganese", "name": "锰", "unit": "毫克", "fold": true},
            {"data_key": "chromium", "name": "铬", "unit": "毫克", "fold": true},
            {"data_key": "mercury", "name": "汞", "unit": "毫克", "fold": true}
        ]
    },
    {
        "name": "拉屎了吗", "data_key": "shitList",
        "pageFields": [
            {field_type: "2", "data_key": "yes_or_no", "name": "是否拉屎", "ddfld": "yes_or_no", "default": "1"},
            {"data_key": "createTime", "name": "记录时间", "fold": true, "default": "initialization_time"},
            {"data_key": "remark", "name": "备注", "fold": true}
        ]
    },
    {
        "name": "经期记录", "data_key": "periodList",
        "pageFields": [
            {"name": "开始时间", "data_key": "start_day"},
            {"name": "结束时间", "data_key": "end_day"},
            {"name": "备注", "data_key": "remark"},
            {"name": "类型", "data_key": "time_record_type", "ddfld": "time_record_type", "default": "1"}
        ]
    },
    {
        "name": "体重记录", "data_key": "bodyList",
        "pageFields": [
            {"name": "重量", "data_key": "weight"},
            {"name": "记录时间", "data_key": "day"},
        ]
    },
    {
        "name": "饮食摄入", "data_key": "dietList",
        "pageFields": [
            {"name": "重量", "data_key": "weight"},
            {"name": "记录时间", "data_key": "day"},
        ]
    },
    {
        "name": "食谱记录", "data_key": "recipeList", "remark": "可随机组合食谱",
        "pageFields": [
            {"name": "重量", "data_key": "weight"},
            {"name": "记录时间", "data_key": "day"},
        ]
    },
    {"pageId": "page_json", "name": "编辑", "toolShow": false},
];
for (let i = 0; i < memuList.length; i++) {
    if (memuList[i].pageId == null) {
        memuList[i].pageId = "page_id_" + i;
    }
    if (memuList[i].toolShow == null) {
        memuList[i].toolShow = true;
    }
    let queryListKey = memuList[i].queryListKey || "";
    let queryListName = "";
    const is_create_queryListKey = !queryListKey;//是否生成queryListKey，如果没有则根据pageFields生成
    if (memuList[i].pageFields != null && memuList[i].pageFields.length > 0) {
        for (let p = 0; p < memuList[i].pageFields.length; p++) {
            if (memuList[i].pageFields[p].fold == null) {
                memuList[i].pageFields[p].fold = false;
            }
            if (memuList[i].pageFields[p].field_type == null) {
                memuList[i].pageFields[p].field_type = 1;
            }
            if (memuList[i].pageFields[p].unit == null) {
                memuList[i].pageFields[p].unit = "";
            } else if (memuList[i].pageFields[p].unit != "") {
                memuList[i].pageFields[p].unit = "(" + memuList[i].pageFields[p].unit + ")";
            }
            if (is_create_queryListKey && memuList[i].pageFields[p].data_key) {
                queryListKey += (!queryListKey ? "" : ",") + memuList[i].pageFields[p].data_key;
            }
            if (("," + queryListKey + ",").indexOf("," + memuList[i].pageFields[p].data_key + ",") >= 0) {
                queryListName += (!queryListName ? "" : ",") + memuList[i].pageFields[p].name;
            }
        }
        memuList[i].queryListKey = queryListKey;
        memuList[i].queryListName = queryListName;
    }
}
