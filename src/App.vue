<template>
  <a-layout id="app">
    <a-layout-header class="header flexrow">
      <h2>eStudy</h2>
      <!-- 头部信息 -->
      <div class="right flexrow" v-if="loggedIn">
        <div v-if="isTeacher" class="flexrow">
          <h4>{{info.name}}</h4>
          <a-button icon="file-add" class="vcenter" type="primary" @click="revisingWork=true">新建作业</a-button>
          <a-modal :visible="Boolean(revisingWork)" @cancel="revisingWork = false" :footer="null">
            <form action>
              <a-form-item label="课程">
                <a-select v-model="revisingForm.org_id"
                v-validate="'required'" data-vv-as="课程"
                :class="{ error: errors.has('org_id') }"
              >
                <a-select-option v-for="(org, index) of teacher.orgs" :key="`org_${index}`"
                  :value="org.id">{{ org.full_name }}</a-select-option>
              </a-select>
              </a-form-item>
              <a-form-item label="作业名称">
                <a-textarea v-model="revisingForm.name" autosize></a-textarea>
              </a-form-item>
              <a-form-item label="开始结束时间">
                <a-range-picker @change="onChange"/>
              </a-form-item>
              <a-form-item>
                <a-button @click="save" type="primary">确定</a-button>
              </a-form-item>
            </form>
          </a-modal>
        </div>
        <div v-else class="flexrow">
          <h4 class="flexcol">
            <span>{{info.full_name}}</span>
            <span>学号:{{info.name}}</span>
          </h4>
          <h5>
            <span v-for="(org,index) in student.orgs" :key="`${org}_${index}`">{{org}}</span>
          </h5>
          <div>
            <span class="label">{{student.stats.uncommitted}}个作业待提交</span>
            <span class="label">{{student.stats.revising}}个作业待批改</span>
            <span class="label">{{student.stats.improvable}}个作完善</span>
            <span class="label">{{student.stats.finished}}个作业待提交</span>
          </div>
        </div>
        <a href="http://vipgit.chanke.xyz" target="_blank">
          <a-button class="vcenter" icon="home">代码仓库</a-button>
        </a>
        <a-button class="vcenter" @click="$store.dispatch('user/logout')" icon="logout">退出</a-button>
      </div>
    </a-layout-header>
    <a-layout-content>
      <Authorization v-if="!loggedIn"></Authorization>
      <div v-else>
        <teacher v-if="isTeacher" :teacher="teacher"></teacher>
        <student v-else :student="student"></student>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import Authorization from "./components/Authorization";
import teacher from "./components/teacher";
import student from "./components/student";
import { api } from "./api.js"; //引入axios
export default {
  name: "app",
  components: {
    Authorization,
    teacher,
    student
  },
  data() {
    return {
      revisingForm: {
        org_id: "",
        name: "",
        start_time: "",
        end_time: ""
      },
      revisingWork: false,
      student: {
        orgs: [],
        assignments: [],
        stats: {}
      },
      teacher: {
        orgs: [],
        assignments: [],
        stats: {}
      }
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.user.loggedIn;
    },
    info() {
      // this.$store.state.user.info.full_name = "刘喆";
      return this.$store.state.user.info;
    },
    isTeacher() {
      return this.info.is_admin > 0;
    }
  },
  watch: {
    loggedIn(val) {
      //监听loggenIn的变化判断是否登陆成功,
      if (val) {
        this.loadDetails(); //请求用户数据
      }
    }
  },
  created() {
    if (this.loggedIn) {
      //说明自动登陆，获取用户信息
      this.loadDetails();
    }
  },
  methods: {
    onChange(date, dateString) {
      console.log(dateString[0]);
      this.revisingForm.start_time = dateString[0];
      this.revisingForm.end_time = dateString[1];
    },
    save() {
      console.log(this.revisingForm);
      const form = {
        org_id: this.revisingForm.org_id,
        name: this.revisingForm.name,
        start_time: this.revisingForm.start_time,
        end_time: this.revisingForm.end_time
      };
      api
        .post("/teacher/createAssignment", form)
        .then(data => {
          console.log(data);
          this.loadDetails();
        })
        .finally(() => {
          this.revisingWork = false;
        });
    },
    log() {
      this.loggedIn = !this.loggedIn;
      // console.log(this.loggedIn);
    },
    loadDetails() {
      //判断学生还是老师加载
      if (this.isTeacher) {
        api.get("/teacher/detail").then(data => {
          console.log(data);
          this.teacher.orgs = data.orgs;
          this.teacher.assignments = data.assignments;
        });
      } else {
        api.get("/student/detail").then(data => {
          this.student.orgs = data.orgs;
          this.student.assignments = data.assignments;
          this.student.stats = data.stats;
        });
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  min-width: 1005px;
}

.header {
  font-size: 1.1em;
  h2,
  h4,
  h5 {
    margin-right: 25px;
    color: white;
  }
  .label {
    padding: 0 5px;
  }
}

.flexrow {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.right {
  margin-left: auto;
  color: white;
}

.flexcol {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  span {
    flex: 1;
    max-height: 20px;
    line-height: 20px;
  }
}

.vcenter {
  align-self: center;
}
</style>
