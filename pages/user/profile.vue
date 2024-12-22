<script setup>
definePageMeta({
  layout: 'user',
  middleware: 'auth'
});
const { showSuccessAlert, showErrorAlert } = useAlert();

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const { getUserInfo, updateUserInfo } = userStore;

const localUserInfo = ref(JSON.parse(JSON.stringify(userInfo.value)));

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 生日年月日
const selectedYear = ref(1);
const selectedMonth = ref(1);
const selectedDay = ref(1);

selectedYear.value =
  new Date(localUserInfo.value.birthday).getFullYear() - 1958;
selectedMonth.value = new Date(localUserInfo.value.birthday).getMonth() + 1;
selectedDay.value = new Date(localUserInfo.value.birthday).getDate();

const fullBirthdayFormate = computed(() => {
  const date = new Date(localUserInfo.value.birthday);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year} 年 ${month} 月 ${day} 日`;
});

// 選擇縣市區域取得郵遞區號
const { $TWzipcode } = useNuxtApp();
const twzipcodeRef = ref(null);
let twzipcodeInstance = null;
let zipcode = ref(null);
let fullAddress = ref(null);

onMounted(() => {
  twzipcodeInstance = $TWzipcode(twzipcodeRef, {
    district: {
      onChange(id) {
        const { county, district } = this.nth(id).get();
        zipcode.value = this.nth(id).get()?.zipcode;
        fullAddress.value = `${county}${district}${localUserInfo.value.address.detail}`;
      }
    },
    combine: false
  });

  // 初始設定地址郵遞區號
  const defaultZipcode = localUserInfo.value.address.zipcode.toString();
  twzipcodeInstance.set(defaultZipcode);
});

// 更新密碼或個人資料
const isEditPassword = ref(false);
const isEditProfile = ref(false);

const updateProfile = async (value = {}, { resetForm }) => {
  try {
    const options = {
      userId: localUserInfo.value._id,
      name: localUserInfo.value.name,
      phone: localUserInfo.value.phone,
      birthday: `${selectedYear.value + 1958}/${selectedMonth.value}/${
        selectedDay.value
      }`,
      address: {
        ...localUserInfo.value.address,
        zipcode: Number(zipcode.value)
      }
    };

    const resUserInfo = await updateUserInfo(options);

    await showSuccessAlert('個人資料更新成功');

    // update local user info
    localUserInfo.value = { ...resUserInfo };

    isEditProfile.value = false;
  } catch (error) {
    await showErrorAlert(error.data?.message || '個人資料更新失敗');

    resetForm();
  }
};

const updatePassword = async (value = {}, { resetForm }) => {
  try {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      await showErrorAlert('新密碼與確認密碼不一致');

      return;
    }

    await updateUserInfo({
      userId: localUserInfo.value._id,
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    });

    await showSuccessAlert('密碼更新成功');

    isEditPassword.value = false;
  } catch (error) {
    await showErrorAlert(error.data?.message || '密碼更新失敗');
  } finally {
    resetForm();
  }
};
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-5">
      <VForm
        v-slot="{ errors, meta, resetForm }"
        @submit="updatePassword"
      >
        <section
          class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
        >
          <h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
          <div class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              >
                {{ localUserInfo.email }}
              </span>
            </div>

            <div
              class="d-flex justify-content-between align-items-center"
              :class="{ 'd-none': isEditPassword }"
            >
              <div>
                <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                  密碼
                </label>
                <input
                  class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                  type="password"
                  value="**********"
                />
              </div>

              <button
                class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
                type="button"
                @click="isEditPassword = !isEditPassword"
              >
                重設
              </button>
            </div>

            <div
              class="d-flex flex-column gap-4 gap-md-6"
              :class="{ 'd-none': !isEditPassword }"
            >
              <div>
                <label
                  for="oldPassword"
                  class="form-label fs-8 fs-md-7 fw-bold"
                >
                  舊密碼
                </label>
                <VField
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  class="form-control p-4 fs-7 rounded-3"
                  :class="{
                    'is-invalid': errors.oldPassword
                  }"
                  v-model="passwordForm.oldPassword"
                  placeholder="請輸入舊密碼"
                  rules="required"
                />
                <VErrorMessage
                  name="oldPassword"
                  class="invalid-feedback"
                />
              </div>

              <div>
                <label
                  for="newPassword"
                  class="form-label fs-8 fs-md-7 fw-bold"
                >
                  新密碼
                </label>

                <VField
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  class="form-control p-4 fs-7 rounded-3"
                  :class="{
                    'is-invalid': errors.newPassword
                  }"
                  v-model="passwordForm.newPassword"
                  placeholder="請輸入新密碼"
                  rules="required"
                />
                <VErrorMessage
                  name="newPassword"
                  class="invalid-feedback"
                />
              </div>

              <div>
                <label
                  for="confirmPassword"
                  class="form-label fs-8 fs-md-7 fw-bold"
                >
                  確認新密碼
                </label>

                <VField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  class="form-control p-4 fs-7 rounded-3"
                  :class="{
                    'is-invalid': errors.confirmPassword
                  }"
                  v-model="passwordForm.confirmPassword"
                  placeholder="請再輸入一次新密碼"
                  rules="required"
                />
                <VErrorMessage
                  name="confirmPassword"
                  class="invalid-feedback"
                />
              </div>
            </div>

            <button
              :class="{ 'd-none': !isEditPassword }"
              class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
              type="submit"
              :disabled="!meta.valid"
            >
              儲存設定
            </button>
          </div>
        </section>
      </VForm>
    </div>

    <div class="col-12 col-md-7">
      <VForm
        v-slot="{ errors, meta, resetForm }"
        @submit="updateProfile"
      >
        <section
          class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
        >
          <h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>

          <div class="d-flex flex-column gap-4 gap-md-6">
            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile
                }"
                for="name"
              >
                姓名
              </label>
              <VField
                id="name"
                name="name"
                class="form-control text-neutral-100 fw-bold"
                :class="{
                  'pe-none p-0 border-0': !isEditProfile,
                  'p-4': isEditProfile,
                  'is-invalid': errors.name
                }"
                v-model="localUserInfo.name"
                placeholder="請輸入姓名"
                rules="required"
              />
              <VErrorMessage
                name="name"
                class="invalid-feedback"
              />
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile
                }"
                for="phone"
              >
                手機號碼
              </label>
              <VField
                id="phone"
                name="phone"
                class="form-control text-neutral-100 fw-bold"
                :class="{
                  'pe-none p-0 border-0': !isEditProfile,
                  'p-4': isEditProfile,
                  'is-invalid': errors.phone
                }"
                placeholder="請輸入手機號碼"
                rules="required|phone"
                type="tel"
                v-model="localUserInfo.phone"
              />
              <VErrorMessage
                name="phone"
                class="invalid-feedback"
              />
            </div>

            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile
                }"
                for="birth"
              >
                生日
              </label>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                :class="{ 'd-none': isEditProfile }"
              >
                {{ fullBirthdayFormate }}
              </span>
              <div
                class="d-flex gap-2"
                :class="{ 'd-none': !isEditProfile }"
              >
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

            <div class="fs-8 fs-md-7">
              <label
                class="form-label"
                :class="{
                  'fw-bold text-neutral-100': isEditProfile,
                  'fw-medium text-neutral-80': !isEditProfile
                }"
                for="address"
              >
                地址
              </label>
              <span
                class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                :class="{ 'd-none': isEditProfile }"
              >
                {{ fullAddress }}
              </span>
              <div :class="{ 'd-none': !isEditProfile }">
                <div
                  ref="twzipcodeRef"
                  class="twzipcode d-flex gap-2 mb-2"
                >
                  <select
                    data-role="county"
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  ></select>
                  <select
                    data-role="district"
                    class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  ></select>
                  <input
                    type="hidden"
                    data-role="zipcode"
                  />
                </div>
                <VField
                  id="address"
                  name="address"
                  rules="required"
                  type="text"
                  class="form-control p-4 rounded-3"
                  :class="{ 'is-invalid': errors.address }"
                  placeholder="請輸入詳細地址"
                  v-model="localUserInfo.address.detail"
                />
                <VErrorMessage
                  name="address"
                  class="invalid-feedback"
                />
              </div>
            </div>
          </div>
          <button
            :class="{ 'd-none': isEditProfile }"
            class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
            type="button"
            @click="isEditProfile = !isEditProfile"
          >
            編輯
          </button>
          <button
            :class="{ 'd-none': !isEditProfile }"
            class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
            type="submit"
            :disabled="!meta.valid"
          >
            儲存設定
          </button>
        </section>
      </VForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type='password'] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
