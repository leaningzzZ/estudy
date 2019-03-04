<template>
  <div class="authorization">
    <form action @submit.prevent="submits">
      <div class="filed">
        <a-input
          type="text"
          v-validate="'required'"
          name="name"
          placeholder="请输入用户名"
          v-model="form.name"
          :class="{error:errors.has('name')}"
          data-vv-as="用户名"
        >
          <a-icon slot="prefix" type="user" class="icon"></a-icon>
        </a-input>
        <span class="error-type">{{errors.first("name")}}</span>
      </div>
      <div class="filed">
        <a-input
          type="password"
          v-validate="'required'"
          name="password"
          placeholder="请输入密码"
          v-model="form.password"
          :class="{error:errors.has('password')}"
          data-vv-as="密码"
        >
          <a-icon slot="prefix" type="lock" class="icon"></a-icon>
        </a-input>
        <span class="error-type">{{errors.first("password")}}</span>
      </div>
      <div class="filed">
        <a-button type="primary" htmlType="submit">登陆</a-button>
        <p>{{form.name}}{{form.password}}</p>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        password: ""
      }
    };
  },
  methods: {
    submits() {
      // 验证是否账号密码都填入
      this.$validator.validateAll().then(result => {
        if (result) {
            this.$store.dispatch("user/login",this.form)
        }
      });
    }
  }
};
</script>
<style lang="scss">
form {
  width: 400px;
  padding-top: 50px;
}
.authorization {
  display: flex;
  justify-content: center;
}
.filed {
  margin: 20px;
  button {
    width: 100%;
  }
}
.icon {
  color: rgba(0, 0, 0, 0.25);
}
.error-type {
  color: red;
  font-size: 12px;
}
.error {
  border: 1px solid red;
}
</style>
