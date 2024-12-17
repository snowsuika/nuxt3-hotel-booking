<script setup>
const router = useRouter();

definePageMeta({
  layout: 'auth'
});

useHead({
  script: [
    {
      src: 'https://code.essoduke.org/js/twzipcode/twzipcode.latest.js',
      async: true
    }
  ]
});

const { isEnabled, userSignupObject, onSignup } = useSignup();
const { showSuccessAlert, showErrorAlert } = useAlert();

const emailPasswardFormRef = ref(null);
const personalInfoFormRef = ref(null);

const isEmailAndPasswordValid = ref(false);
const isAgreementCheck = ref(false);
const confirmPassword = ref('');
const selectedYear = ref(1);
const selectedMonth = ref(1);
const selectedDay = ref(1);

const vaildEmailAndPassward = async () => {
  if (userSignupObject.value.password !== confirmPassword.value) {
    await showErrorAlert('兩次密碼不同');
    return;
  }

  isEmailAndPasswordValid.value = true;
};

const preSubmitSignup = async () => {
  if (!isAgreementCheck.value) {
    await showErrorAlert('請閱讀並同意本網站個資使用規範');
    return;
  }

  userSignupObject.value.birthday = `${selectedYear.value + 1958}/${
    selectedMonth.value
  }/${selectedDay.value}`;

  try {
    await onSignup();
    await showSuccessAlert('註冊成功');
    router.push('/');
  } catch (error) {
    await showErrorAlert(error);
  } finally {
    emailPasswardFormRef.value.resetForm();
    personalInfoFormRef.value.resetForm();
  }
};

onMounted(() => {
  new TWzipcode({
    district: {
      onChange(id) {
        userSignupObject.value.address.zipcode = Number(
          this.nth(id).get()?.zipcode
        );
      }
    }
  });
});
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <button @click="preSubmitSignup">click</button>
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">立即註冊</h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': isEmailAndPasswordValid }"
            class="step p-2 bg-primary-100 rounded-circle"
          >
            1
          </span>
          <Icon
            :class="{ 'd-none': !isEmailAndPasswordValid }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            name="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

        <div
          :class="{
            'text-neutral-0': isEmailAndPasswordValid,
            'text-neutral-60': !isEmailAndPasswordValid
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': isEmailAndPasswordValid,
              'bg-transparent border border-neutral-60':
                !isEmailAndPasswordValid
            }"
            class="step p-2 rounded-circle"
          >
            2
          </span>
          <p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <VForm
        v-slot="{ errors, meta, resetForm }"
        class="mb-4"
        :class="{ 'd-none': isEmailAndPasswordValid }"
        ref="emailPasswardFormRef"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="email"
          >
            電子信箱
          </label>
          <VField
            id="email"
            name="email"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors.email }"
            v-model="userSignupObject.email"
            placeholder="請輸入信箱"
            rules="required|email"
            type="email"
          />
          <VErrorMessage
            name="email"
            class="invalid-feedback"
          />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="password"
          >
            密碼
          </label>
          <VField
            id="password"
            name="password"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors.password }"
            v-model="userSignupObject.password"
            placeholder="請輸入 8 碼以上密碼"
            rules="required|min:8"
            type="password"
          />
          <VErrorMessage
            name="password"
            class="invalid-feedback"
          />
        </div>
        <div class="mb-10 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="confirmPassword"
          >
            確認密碼
          </label>
          <VField
            id="confirmPassword"
            name="confirmPassword"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors.confirmPassword }"
            v-model="confirmPassword"
            placeholder="請再輸入一次密碼"
            rules="required"
            type="password"
          />
          <VErrorMessage
            name="confirmPassword"
            class="invalid-feedback"
          />
        </div>
        <button
          class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
          type="button"
          :disabled="!meta.valid"
          @click="vaildEmailAndPassward"
        >
          下一步
        </button>
        {{ meta.valid }}
      </VForm>
      <VForm
        v-slot="{ errors, meta, resetForm }"
        @submit="preSubmitSignup"
        class="mb-4"
        :class="{ 'd-none': !isEmailAndPasswordValid }"
        ref="personalInfoFormRef"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="name"
          >
            姓名
          </label>
          <VField
            id="name"
            name="name"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            :class="{ 'is-invalid': errors.name }"
            v-model="userSignupObject.name"
            placeholder="請輸入姓名"
            rules="required"
            type="name"
          />
          <VErrorMessage
            name="name"
            class="invalid-feedback"
          />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="phone"
          >
            手機號碼
          </label>

          <VField
            id="phone"
            name="phone"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            :class="{ 'is-invalid': errors.phone }"
            v-model="userSignupObject.phone"
            placeholder="請輸入手機號碼"
            rules="required|phone"
            type="tel"
          />
          <VErrorMessage
            name="phone"
            class="invalid-feedback"
          />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="birth"
          >
            生日
          </label>
          <div class="d-flex gap-2">
            <select
              v-model="selectedYear"
              id="birth"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
            >
              <option
                v-for="year in 65"
                :key="year"
                :value="year"
              >
                {{ year + 1958 }} 年
              </option>
            </select>

            <select
              v-model="selectedMonth"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
            >
              <option
                v-for="month in 12"
                :key="month"
                :value="month"
              >
                {{ month }} 月
              </option>
            </select>
            <select
              v-model="selectedDay"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
            >
              <option
                v-for="day in 30"
                :key="day"
                :value="day"
              >
                {{ day }} 日
              </option>
            </select>
          </div>
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="form-label text-neutral-0 fw-bold"
            for="address"
          >
            地址
          </label>
          <div>
            <div class="twzipcode">
              <div class="d-flex gap-2 mb-2">
                <select
                  data-role="county"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                ></select>

                <select
                  data-role="district"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                ></select>
              </div>
              <input
                type="hidden"
                data-role="zipcode"
              />
            </div>
            <VField
              id="address"
              name="address"
              class="form-control p-4 rounded-3"
              :class="{ 'is-invalid': errors.address }"
              v-model="userSignupObject.address.detail"
              placeholder="請輸入詳細地址"
              rules="required"
              type="text"
            />
            <VErrorMessage
              name="address"
              class="invalid-feedback"
            />
          </div>
        </div>

        <div
          class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0"
        >
          <input
            id="agreementCheck"
            class="form-check-input"
            type="checkbox"
            :checked="isAgreementCheck"
            v-model="isAgreementCheck"
          />
          <label
            class="form-check-label fw-bold"
            for="agreementCheck"
          >
            我已閱讀並同意本網站個資使用規範
          </label>
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="submit"
          :disabled="meta.value"
        >
          完成註冊
        </button>
      </VForm>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
      </NuxtLink>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/mixins/breakpoints';

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px
);

input[type='password'] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>
