<script setup>
definePageMeta({
  middleware: 'auth'
});
/**
 * TWzipcode 實例
 */
const twzipcodeInstance = ref(null);

useHead({
  script: [
    {
      src: 'https://code.essoduke.org/js/twzipcode/twzipcode.latest.js',
      async: true,
      onload: () => {
        twzipcodeInstance.value = new TWzipcode({
          district: {
            onChange(id) {
              if (boookingInfo.value?.userInfo?.address) {
                boookingInfo.value.userInfo.address.zipcode = Number(
                  this.nth(id).get()?.zipcode
                );
              }
            }
          }
        });
      }
    }
  ]
});

const route = useRoute();
const router = useRouter();
import BookingLoading from '@/components/rooms/BookingLoading.vue';
const { $priceCommaFormat } = useNuxtApp();

const goBack = () => {
  router.back();
};
  const isLoading = ref(false);
const confirmBooking = () => {
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    router.push(`/rooms/${route.params?.id}/booking/result`);
  }, 1500);
};

// 取得訂房資訊
const bookingStore = useBookingStore();
const { bookingData } = storeToRefs(bookingStore);


if (Object.keys(bookingData.value).length === 0) {
  goBack();
}

const discount = 1000;
const total = computed(() => {
  return (
    bookingData.value?.bookingInfo?.daysCount *
    bookingData.value?.roomDetail?.price
  );
});

// 取得使用者個人資料
const { userInfo } = storeToRefs(userStore);
const userStore = useUserStore();


// 訂房人資訊
const boookingInfo = ref({
  roomId: route.params?.id,
  checkInDate: bookingData.value?.bookingInfo?.date?.start,
  checkOutDate: bookingData.value?.bookingInfo?.date?.end,
  peopleNum: bookingData.value?.bookingInfo?.bookingPeople,
  userInfo: {
    address: {
      zipcode: null,
      detail: ''
    },
    name: '',
    phone: '',
    email: ''
  }
});

// 套用會員資料
const applyMemberData = () => {
  boookingInfo.value.userInfo = {
    address: {
      zipcode: userInfo.value?.address?.zipcode,
      detail: userInfo.value?.address?.detail
    },
    name: userInfo.value?.name,
    phone: userInfo.value?.phone,
    email: userInfo.value?.email
  };

  // 更新 TWzipcode 郵遞區號
  if (userInfo.value?.address?.zipcode && twzipcodeInstance.value) {
    twzipcodeInstance.value.set(userInfo.value.address.zipcode.toString());
  }
};
</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="goBack"
        >
          <Icon
            class="fs-5 text-neutral-100"
            name="mdi:keyboard-arrow-left"
          />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">確認訂房資訊</h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">選擇房型</h3>
                    <p class="mb-0 fw-medium">
                      {{ bookingData.roomDetail.name }}
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">訂房日期</h3>
                    <p class="mb-2 fw-medium">
                      入住：{{ bookingData.bookingInfo.date.start }}
                    </p>
                    <p class="mb-0 fw-medium">
                      退房：{{ bookingData.bookingInfo.date.end }}
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">房客人數</h3>
                    <p class="mb-0 fw-medium">
                      {{ bookingData.bookingInfo.bookingPeople }} 人
                    </p>
                  </div>
                  <button
                    class="bg-transparent border-0 fw-bold text-decoration-underline"
                    type="button"
                  >
                    編輯
                  </button>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <div
                class="d-flex justify-content-between align-items-center mb-10"
              >
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button"
                  @click="applyMemberData"
                >
                  套用會員資料
                </button>
              </div>
              <VForm
                v-slot="{ errors, meta, resetForm }"
                @submit="confirmBooking"
                class="mb-4"
                ref="memberFormRef"
              >
                <div class="d-flex flex-column gap-6">
                  <div class="text-neutral-100">
                    <label
                      for="name"
                      class="form-label fs-8 fs-md-7 fw-bold"
                    >
                      姓名
                    </label>
                    <VField
                      id="name"
                      name="name"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors.name }"
                      v-model="boookingInfo.userInfo.name"
                      placeholder="請輸入姓名"
                      rules="required"
                      type="name"
                    />
                    <VErrorMessage
                      name="name"
                      class="invalid-feedback"
                    />
                  </div>

                  <div class="text-neutral-100">
                    <label
                      for="phone"
                      class="form-label fs-8 fs-md-7 fw-bold"
                    >
                      手機號碼
                    </label>

                    <VField
                      id="phone"
                      name="phone"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors.phone }"
                      v-model="boookingInfo.userInfo.phone"
                      placeholder="請輸入手機號碼"
                      rules="required|phone"
                      type="tel"
                    />
                    <VErrorMessage
                      name="phone"
                      class="invalid-feedback"
                    />
                  </div>

                  <div class="text-neutral-100">
                    <label
                      for="email"
                      class="form-label fs-8 fs-md-7 fw-bold"
                    >
                      電子信箱
                    </label>
                    <VField
                      id="email"
                      name="email"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors.email }"
                      v-model="boookingInfo.userInfo.email"
                      placeholder="請輸入電子信箱"
                      rules="required|email"
                      type="temailel"
                    />
                    <VErrorMessage
                      name="email"
                      class="invalid-feedback"
                    />
                  </div>

                  <div class="text-neutral-100">
                    <label
                      for="address"
                      class="form-label fs-8 fs-md-7 fw-bold"
                    >
                      地址
                    </label>
                    <div className="twzipcode d-flex gap-2 mb-4">
                      <select
                        data-role="county"
                        class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                      ></select>
                      <select
                        data-role="district"
                        class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                      ></select>
                      <input
                        type="hidden"
                        data-role="zipcode"
                      />
                    </div>
                    <VField
                      id="address"
                      name="address"
                      class="form-control p-4 fs-8 fs-md-7 rounded-3"
                      :class="{ 'is-invalid': errors.address }"
                      v-model="boookingInfo.userInfo.address.detail"
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
              </VForm>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        name="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ bookingData.roomDetail.areaInfo }} 坪
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        name="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ bookingData.roomDetail.bedInfo }}
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        name="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ bookingData.roomDetail.maxPeople }} 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房間格局
                  </h3>
                  <ul
                    class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      class="d-flex gap-2"
                      v-for="item in bookingData.roomDetail.layoutInfo"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        name="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ item.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房內設備
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      class="flex-item d-flex gap-2"
                      v-for="item in bookingData.roomDetail.facilityInfo"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        name="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ item.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    備品提供
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      class="flex-item d-flex gap-2"
                      v-for="item in bookingData.roomDetail.amenityInfo"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        name="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ item.title }}
                      </p>
                    </li>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
            >
              <img
                class="img-fluid rounded-3"
                src="@/assets/images/room-a-1.png"
                alt="room-a"
              />

              <div>
                <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <div
                    class="d-flex align-items-center text-neutral-100 fw-medium"
                  >
                    <span>
                      NT$ {{ $priceCommaFormat(bookingData.roomDetail.price) }}
                    </span>
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      name="material-symbols:close"
                    />
                    <span class="text-neutral-80">
                      {{ bookingData.bookingInfo.daysCount }} 晚
                    </span>
                  </div>
                  <span class="fw-medium">
                    NT$
                    {{ $priceCommaFormat(total) }}
                  </span>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center fw-medium"
                >
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100">
                    -NT$ {{ $priceCommaFormat(discount) }}
                  </span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40" />
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold"
                >
                  <p class="d-flex align-items-center mb-0">總價</p>
                  <span>NT$ {{ $priceCommaFormat(total - discount) }}</span>
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="button"
                @click="confirmBooking"
              >
                確認訂房
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BookingLoading v-if="isLoading" />
  </main>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #bf9d7d;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  // flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>
