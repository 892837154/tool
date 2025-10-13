/**
 * 默认菜单列表
 * data_key:数据存储字段
 * default:默认值
 * */
const defaultMenuList = [
    {name: "首页", "toolShow": false},
    {name: "记事本"},
    {
        name: "热量计算器", data_key: "heatList",
        queryListKey: "food_name,calorie,protein,fat,carbohydrate,sugar,dietary_fiber,sodium",//查询结果字段
        pageFields: [
            {data_key: "food_name", name: "食物名称"},
            {data_key: "calorie", name: "热量", unit: "千卡"},
            {data_key: "protein", name: "蛋白质", unit: "克"},
            {data_key: "fat", name: "脂肪", unit: "克"},
            {data_key: "dha", name: "-DHA", unit: "", "fold": true},
            {data_key: "saturated_fat", name: "-饱和脂肪", unit: "克", "fold": true},
            {data_key: "trans_fat", name: "-反式脂肪", unit: "克", "fold": true},
            {data_key: "monounsaturated", name: "-单不饱和脂肪", unit: "克", "fold": true},
            {data_key: "polyunsaturated", name: "-多不饱和脂肪", unit: "克", "fold": true},
            {data_key: "cholesterol", name: "胆固醇", unit: "毫克", "fold": true},
            {data_key: "carbohydrate", name: "碳水化合物", unit: "克"},
            {data_key: "sugar", name: "糖", unit: "克"},
            {data_key: "dietary_fiber", name: "膳食纤维", unit: "克"},
            {data_key: "sodium", name: "钠", unit: "毫克"},
            {data_key: "alcohol_by_volume", name: "酒精度", unit: "%vol", "fold": true},
            {data_key: "purine", name: "嘌呤", unit: "毫克", "fold": true},
            {data_key: "ash_content", name: "灰分", unit: "", "fold": true},
            {data_key: "gi", name: "GI", unit: "", "fold": true},
            {data_key: "gl", name: "GL", unit: "", "fold": true},
            {data_key: "vitamins", field_type: "10", name: "维生素", "fold": true},
            {data_key: "vitamin_a", name: "维生素A", unit: "IU", "fold": true},
            {data_key: "carotene", name: "胡萝卜素", unit: "微克", "fold": true},
            {data_key: "vitamin_d", name: "维生素D", unit: "微克", "fold": true},
            {data_key: "vitamin_e", name: "维生素E", unit: "毫克", "fold": true},
            {data_key: "vitamin_k", name: "维生素K", unit: "微克", "fold": true},
            {data_key: "vitamin_b1", name: "维生素B1", unit: "毫克", "fold": true},
            {data_key: "vitamin_b2", name: "维生素B2", unit: "毫克", "fold": true},
            {data_key: "vitamin_b6", name: "维生素B6", unit: "毫克", "fold": true},
            {data_key: "vitamin_b12", name: "维生素B12", unit: "微克", "fold": true},
            {data_key: "vitamin_c", name: "维生素C", unit: "毫克", "fold": true},
            {data_key: "niacin", name: "烟酸", unit: "微克", "fold": true},
            {data_key: "folic_acid", name: "叶酸", unit: "微克", "fold": true},
            {data_key: "pantothenic_acid", name: "泛酸", unit: "毫克", "fold": true},
            {data_key: "biotin", name: "生物素", unit: "微克", "fold": true},
            {data_key: "choline", name: "胆碱", unit: "毫克", "fold": true},
            {data_key: "retinol_equivalent", name: "视黄醇当量", unit: "", "fold": true},
            {data_key: "minerals", field_type: "10", name: "矿物质", "fold": true},
            {data_key: "phosphorus", name: "磷", unit: "毫克", "fold": true},
            {data_key: "potassium", name: "钾", unit: "毫克", "fold": true},
            {data_key: "magnesium", name: "镁", unit: "毫克", "fold": true},
            {data_key: "calcium", name: "钙", unit: "毫克", "fold": true},
            {data_key: "iron", name: "铁", unit: "毫克", "fold": true},
            {data_key: "zinc", name: "锌", unit: "毫克", "fold": true},
            {data_key: "iodine", name: "碘", unit: "微克", "fold": true},
            {data_key: "selenium", name: "硒", unit: "微克", "fold": true},
            {data_key: "copper", name: "铜", unit: "毫克", "fold": true},
            {data_key: "fluorine", name: "氟", unit: "毫克", "fold": true},
            {data_key: "manganese", name: "锰", unit: "毫克", "fold": true},
            {data_key: "chromium", name: "铬", unit: "毫克", "fold": true},
            {data_key: "mercury", name: "汞", unit: "毫克", "fold": true}
        ]
    },
    {
        name: "拉屎了吗", data_key: "shitList",
        default: {
            "yes_or_no": "1",
            "createTime": "initialization_time"
        },
        pageFields: [
            {data_key: "yes_or_no", field_type: "2", name: "是否拉屎", "ddfld": "yes_or_no"},
            {data_key: "createTime", field_type: "10", name: "记录时间", "fold": true},
            {data_key: "remark", name: "备注", "fold": true}
        ]
    },
    {
        name: "经期记录", data_key: "periodList",
        default: {
            "time_record_type": "1"
        },
        pageFields: [
            {data_key: "start_day", field_type: "10", name: "开始时间"},
            {data_key: "end_day", field_type: "10", name: "结束时间"},
            {data_key: "remark", name: "备注"},
            {data_key: "time_record_type", name: "类型", "ddfld": "time_record_type"}
        ]
    },
    {
        data_key: "bodyList",
        name: "体重记录",
        pageFields: [
            {data_key: "weight", name: "重量"},
            {field_type: "10", data_key: "day", name: "记录时间",},
        ]
    },
    {
        data_key: "dietList",
        name: "饮食摄入",
        pageFields: [
            {data_key: "weight", name: "重量"},
            {data_key: "day", field_type: "10", name: "记录时间"},
        ]
    },
    {
        data_key: "recipeList",
        name: "食谱记录", "remark": "可随机组合食谱",
        pageFields: [
            {data_key: "weight", name: "重量"},
            {data_key: "day", field_type: "10", name: "记录时间"},
        ]
    },
    {"pageId": "page_json", name: "编辑", "toolShow": false},
];
const menuList = [...defaultMenuList]
/**
 * 初始化menuList
 * toolShow：工具是否隐藏，默认为true（不隐藏）
 * fold：是否默认折叠，默认为false
 * field_type：字段类型，默认为1（input）
 * unit：单位，默认为""
 * queryListKey：查询列表的key，默认为pageFields的data_key
 * queryListName：查询列表的name，默认为pageFields的name
 * */
for (let i = 0; i < defaultMenuList.length; i++) {
    if (menuList[i].pageId == null) {
        menuList[i].pageId = "page_id_" + i;
    }
    if (menuList[i].toolShow == null) {
        menuList[i].toolShow = true;
    }
    let queryListKey = menuList[i].queryListKey || "";
    let queryListName = "";
    const is_create_queryListKey = !queryListKey;//是否生成queryListKey，如果没有则根据pageFields生成
    if (menuList[i].pageFields != null && menuList[i].pageFields.length > 0) {
        for (let p = 0; p < menuList[i].pageFields.length; p++) {
            if (menuList[i].pageFields[p].fold == null) {
                menuList[i].pageFields[p].fold = false;
            }
            if (menuList[i].pageFields[p].field_type == null) {
                menuList[i].pageFields[p].field_type = 1;
            }
            if (menuList[i].pageFields[p].unit == null) {
                menuList[i].pageFields[p].unit = "";
            } else if (menuList[i].pageFields[p].unit != "") {
                menuList[i].pageFields[p].unit = "(" + menuList[i].pageFields[p].unit + ")";
            }
            if (is_create_queryListKey && menuList[i].pageFields[p].data_key) {
                queryListKey += (!queryListKey ? "" : ",") + menuList[i].pageFields[p].data_key;
            }
            if (("," + queryListKey + ",").indexOf("," + menuList[i].pageFields[p].data_key + ",") >= 0) {
                queryListName += (!queryListName ? "" : ",") + menuList[i].pageFields[p].name;
            }
        }
        menuList[i].queryListKey = queryListKey;
        menuList[i].queryListName = queryListName;
    }
}
