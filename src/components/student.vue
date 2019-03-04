<template>
  <div>
    {{student.assignments}}
    <a-table :columns="columns" :dataSource="student.assignments">
      <template slot="operation1" slot-scope="text,record,index">
        <a-upload 
            name="file" 
            :action="uploadHost" 
            :headers="{Token:info.token}"
            :data="{id:record.assignment_id}"
            :showUploadList="false"
            @change="changeUpload">
            <a-button icon="upload">上传</a-button>
            </a-upload>
         <a v-if="record.work" :href="`${downloadHost}?id=${record.work.id}&type=student`">
            <a-button  icon="download">下载</a-button>
         </a>
      </template>
      <template slot="operation2">

      </template>
    </a-table>
  </div>
</template>
<script>
const Host="http://sandbox_api.estudy.chanke.xyz"
import {mapState} from "vuex"
export default {
  props: ["student"],
  computed:{
      ...mapState("user",["info"])
  },
  methods:{
      changeUpload(info){ //学生上传文件
          if(info.file.status==="done"&&info.file.response.data){
            this.$message.info("上传成功")
          }else if(info.file.status==="error"){
            this.$notification.error({
              message:"上传失败",
              description:info.file.response.errorMessage
            })
          }
      }
  },
  data() {
    return {
        uploadHost:Host+"/student/upload",//获取学生作业信息
        downloadHost:Host+"/student/download",//学生下载作业
      columns: [
        {
          title: "课程",
          dataIndex: "org_name" //可以直接找到的数据用dataIndex
        },
        {
          title: "作业",
          dataIndex: "name"
        },
        {
          title: "开始-截至时间",
          customRender(text, record, index) {
            //不能直接找到的数据
            return `${record.start_time}~${record.end_time}`;
          }
        },
        {
          title: "操作",
          scopedSlots: {
            customRender: "operation" //渲染组件
          }
        },
        {
          title: "状态",
          scopedSlots: {
            customRender(text,record){
              console.log(record)
            }
          }
        }, 
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
