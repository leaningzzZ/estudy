<template>
  <div>
    <a-table 
      :rowKey="assignments=>assignments.assignment_id" 
      :columns="columns"
      :pagination="false" 
      :dataSource="student.assignments">
      <template slot="operation" slot-scope="text,record,index">
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
      <template slot="info" slot-scope="text,record,index">
        <div v-if="record.work">
          <div v-if="record.work.status==0">
            {{record.work.teacher_download_time.slice(0,10)=="0000-00-00"?//判断老师是否下载作业
            `${record.work.commit_time}提交`:
            `${record.work.teacher_download_time}老师下载`
            }}
          </div>
          <div v-else-if="record.work.status==1">
            <p>{{`${record.work.review_time}老师提交修改意见`}}</p>
            <a-button @click="visible=record.work">查看详情</a-button>
          </div>
          <div v-else>
            <p>{{`${record.work.review_time}老师完成批改`}}</p>
            <a-button @click="visible=record.work">查看详情</a-button>
          </div>
        </div>
      </template>
    </a-table>
    <a-modal :visible="Boolean(visible)" @cancle="visible=false">
      <h4>批改意见:</h4>
      <p v-if="visible&&visible.teacher_review">{{visible.teacher_review}}</p>
      <p v-if="visible&&visible.teacher_upload_name">
        <!-- //下载老师上传的附件 -->
        <a-button :="`${downloadHost}?id=${visible.id}&type=teacher`">附件</a-button>
      </p>
    </a-modal>
  </div>
</template>
<script>
const Host="http://sandbox_api.estudy.chanke.xyz";
const work_status={
  "0":"待批改",
  "1":"需完善",
  "2":"已完成"
}
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
        visible:false,
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
            customRender(text,record){  //record.work.status判断作业状态
              return record.work? work_status[record.work.status] :"未提交"
          }
        },
        {
          title: "信息",
            scopedSlots: {
            customRender: "info" //渲染组件
          }
        } 
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
