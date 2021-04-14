// 修改默认的图标
function myAddDiyDom(treeId, treeNode) {
    // treeId是整个树形结构附着的ul标签的id
    console.log("treeId : " + treeId);
    // 当前树形节点的全部的数据，包括从后端查询得到的Menu对象的全部属性
    console.log(treeNode);
    // zTree生成id的规则
    // 例子: treeDemo_7_ico
    // 解析:ul标签的id_当前节点的序号_功能
    // 提示:“ul标签的id_当前节点的序号”部分可以通过访问treeNode的tId属性得到
    // 根据id的生成规则拼接出来span标签的id
    var spanId = treeNode.tId + "_ico";
    // 根据控制图标的span标签的id找到这个span标签
    // 删除旧的class
    // 添加新的class
    $("#" + spanId).removeClass().addClass(treeNode.icon)

}

// 在鼠标移入节点范围时添加按钮组
function myAddHoverDom(treeId, treeNode) {
    // 按钮组的标签结构: <span><a><i></i></a><a><i></i></a></span>
    // 按钮组出现的位置:节点中treeDemo_n_a超链接的后面
    // 为了在需要移除按钮组的时候能够精确定位到按钮组所在span，需要给span设置有规律的id
    var btnGroupId = treeNode.tId + "_btnGrp";
    // 判断一下以前是否已经添加了按钮组,如果有那么长度就会大于零，因为之前生成可能会生成很多id相同
    // 的，但是remove的时候只能remove一个
    if ($("#" + btnGroupId).length > 0) {
        return;
    }
    // 准备好html标签
    var addBtn = "<a id = '" + treeNode.id + "' class='addBtn btn btn-info dropdown-toggle btn-xs' style='margin-left:10px;padding-top:0px;' href='#' title='添加子节点'>&nbsp;&nbsp;<i class='fa fa-fw fa-plus rbg '></i></a>";
    var editBtn = "<a id = '" + treeNode.id + "' class='editBtn btn btn-info dropdown-toggle btn-xs' style='margin-left:10px;padding-top:0px;' href='#' title='修改子节点'>&nbsp;&nbsp;<i class='fa fa-fw fa-edit rbg '></i></a>";
    var removeBtn = "<a id = '" + treeNode.id + "' class='removeBtn btn btn-info dropdown-toggle btn-xs' style='margin-left:10px;padding-top:0px;' href='#' title='删除子节点'>&nbsp;&nbsp;<i class='fa fa-fw fa-times rbg '></i></a>";
    var btnHTML = "";
    // 根节点
    var level = treeNode.level;
    if(level == 0){
        btnHTML = btnHTML + addBtn;
    }
    // 分支节点
    if(level == 1){
        btnHTML = addBtn + " " + editBtn;
        var length = treeNode.children.length;
        // 如果当前节点没有子节点 则它自己也可以移除
        if(length == 0){
            btnHTML = btnHTML + " " +  removeBtn;
        }
    }
    // 叶子节点
    if(level == 2){
        btnHTML = editBtn + " " + removeBtn;
    }
    // 在超链接后面追加元素
    var anchorId = treeNode.tId + "_a";
    $("#" + anchorId).after("<span id='" + btnGroupId + "'>" + btnHTML + "</span>")
}

// 在鼠标移入节点范围时删除按钮组
function myRemoveHoverDom(treeId, treeNode) {
    // 拼接按钮组的id
    var btnGroupId = treeNode.tId + "_btnGrp";
    // 移除对应的元素
    $("#" + btnGroupId).remove();

}

function generateTree() {
    // 1.准备生成树形结构的JSON数据，数据的来源是发送Aiax请求得到
    $.ajax({
        "url": "menu/get/whole/tree.json",
        "type": "post",
        "dataType": "json",
        "success": function (response) {
            var result = response.result;
            if (result == "SUCCESS") {
                // 2.创建JSON对象用于存储对zTree所做的设置
                var setting = {
                    "view":{
                        "addDiyDom":myAddDiyDom,
                        "addHoverDom":myAddHoverDom,
                        "removeHoverDom":myRemoveHoverDom
                    },
                    "data":{
                        "key":{
                            "url":"xxx"
                        }
                    }
                };
                // 3.从响应体中获取用来生成树形结构的JSON数据
                var zNodes = response.data;
                // 4.初始化树形结构
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            }
            if (result == "FAILED") {
                layer.msg(response.message);
            }
        }
    });
}