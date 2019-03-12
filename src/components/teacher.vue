<template>
  <div class="teacher">
    <a-table
      :columns="columns"
      :rowKey="assignment => assignment.assignment_id"
      :dataSource="teacher.assignments"
      :pagination="false"
    >
      <!-- 操作列 -->
      <template slot="operation" slot-scope="text,record,index">
        <div v-if="record.work_count>0">
          <a-button
            v-if="!revisingAssignment"
            icon="plus-square"
            type="primary"
            @click="revisingAssignment=record"
          >展开</a-button>
          <a-button v-else icon="minus-square" type="primary" @click="revisingAssignment=false">收起</a-button>
          <a :href="`${downloadHost}All?id=${record.assignment_id}`">
            <a-button icon="download">下载全部</a-button>
          </a>
        </div>
        <div v-else>
          <a-popconfirm
            title="确认删除该作业?"
            okText="确认"
            cancelText="取消"
            @confirm="removeAssignment(record.assignment_id)"
          >
            <a-button icon="delate" type="danger">删除</a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-table
      v-if="revisingAssignment"
      :dataSource="revisingAssignment.works"
      :columns="workColumns"
      :rowKey="work=>work.id"
    >
      <template slot="operation" slot-scope="text,record,index">
        <a :href="`${downloadHost}?id=${record.id}&type=student`">
          <a-button icon="download">下载</a-button>
        </a>
        <a-button icon="form" type="primary" @click="revisingWork=record;revisingForm.review=record.teacher_review">批改</a-button>
      </template>
    </a-table>
    <!-- 批改的对话框 -->
    <a-modal :visible="Boolean(revisingWork)" @cancel="revisingWork = false" :footer="null">
      <form action>
        <a-form-item label="状态">
          <a-select v-model="revisingForm.status">
            <a-select-option
              :key="`status_${status}`"
              v-for="(status_name,status) in work_status"
              :value="status"
            >{{status_name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="批改意见">
          <a-textarea v-model="revisingForm.review" autosize></a-textarea>
        </a-form-item>
        <a-form-item label="附件">
          <a-upload :action="uploadHost" :headers="{Token:info.token}" :data="{id:revisingWork.id}">
            <a-button icon="upload">上传</a-button>
          </a-upload>
        </a-form-item>
        <a-form-item>
          <a-button @click="save" type="primary">保存</a-button>
        </a-form-item>
      </form>
    </a-modal>
  </div>
</template>

<script>
import { api } from "../api";
import {mapState} from "vuex"
const HOST = "http://sandbox_api.estudy.chanke.xyz";
const work_status = {
  "0": "待批改",
  "1": "需完善",
  "2": "已完成"
};
export default {
  name: "Teacher",
  props: ["teacher"],
  data() {
    return {
      work_status,
      revisingForm: {
        status: 1,
        review:""
      },
      revisingWork: false,
      revisingAssignment: false,
      workColumns: [
        {
          title: "学员名字",
          dataIndex: "user.full_name"
        },
        {
          title: "学号",
          dataIndex: "user.name"
        },
        {
          title: "提交作业的名称",
          dataIndex: "student_upload_name"
        },
        {
          title: "提交时间",
          dataIndex: "commit_time"
        },
        {
          title: "状态",
          customRender(text, record, index) {
            return work_status[record.status];
          }
        },
        {
          title: "操作",
          scopedSlots: {
            customRender: "operation"
          }
        }
      ],
      downloadHost: HOST + "/teacher/download",
      uploadHost: HOST + "/teacher/upload",
      downloadHost: HOST + "/teacher/download"
    };
  },
  computed: {
    ...mapState("user",["info"]),
    columns() {
      return [
        {
          title: "课程",
          dataIndex: "org_name"
        },
        {
          title: "作业名称",
          dataIndex: "name"
        },
        {
          title: "开始-截至时间",
          customRender(text, record, index) {
            return `${record.start_time}~${record.end_time}`;
          }
        },
        {
          title: "状态",
          customRender(text, record, index) {
            // 显示学生数量和已提交作业数量
            return (
              `${record.student_count}个学员/${record.work_count}个提交` +
              (record.work_count > 0 ? `- ${record.work_update_time}` : "")
            );
          }
        },
        {
          title: "操作",
          scopedSlots: {
            customRender: "operation"
          },
          key: "operation",
          filteredValue: this.revisingAssignment
            ? [this.revisingAssignment.assignment_id]
            : null,
          onFilter(value, record) {
            return value === record.assignment_id;
          }
        }
      ];
    }
  },
  methods: {
    removeAssignment(assignmentId) {
      api.post('/teacher/deleteAssignment', { id: assignmentId }).then(resp => {
        const index = this.teacher.assignments.findIndex(assignment => assignment.assignment_id == assignmentId);
        if (index != -1) {
          this.teacher.assignments.splice(index, 1);
          this.$message.info('作业已删除');
        }
      });
    },
    save(){
      console.log(this.revisingForm);
      const form ={
        id: this.revisingWork.id,
        status:this.revisingForm.status,
        review:this.revisingForm.review,
      }
      api.post("/teacher/review",form).then(data=>{
        console.log(data);
        // 将本地状态数据更新
        Object.entries(data).forEach(item=>this.$set(this.revisingWork,item[0],item[1]))
      }).finally(()=>{
          this.revisingWork=false;
        })
    }
  }
};
</script>