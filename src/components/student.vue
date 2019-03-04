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
            @change="changeUpload">
            <a-button icon="upload">上传</a-button>
            </a-upload>
      </template>
      <template slot="operation2">
        <a href="">111</a>
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
      changeUpload(info){
          console.log(info)
      }
  },
  data() {
    return {
        uploadHost:Host+"/student/upload",
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
            customRender: "operation1" //渲染组件
          }
        },
        {
          title: "操作2",   
          scopedSlots: {
            customRender: "operation2" //渲染组件
          }
        }
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
