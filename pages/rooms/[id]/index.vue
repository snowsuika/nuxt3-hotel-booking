<script setup>
const route = useRoute();
const { $priceCommaFormat } = useNuxtApp();
const isLoading = useState('loading');

/**
 * Room Detail Data
 */
const roomId = route.params?.id;
const { roomDetail, getRoomDetail } = useRoom();

try {
  isLoading.value = true;
  await getRoomDetail(roomId);
} catch (error) {
  navigateTo('/rooms');
} finally {
  isLoading.value = false;
}

/**
 * Date Picker Modal
 */
import DatePickerModal from '@/components/rooms/DatePickerModal.vue';
const datePickerModalRef = ref(null);
const bookingPeople = ref(1);
const daysCount = ref(0);

const openSelectDateModal = () => {
  datePickerModalRef.value.openModal();
};
const daysFormatOnMobile = (date) => date?.split('-').slice(1, 3).join(' / ');

const formatDate = (date) => {
  const offsetToUTC8 = date.getHours() + 8;
  date.setHours(offsetToUTC8);
  return date.toISOString().split('T')[0];
};

const currentDate = new Date();

const bookingDate = reactive({
  date: {
    start: formatDate(currentDate),
    end: null
  },
  minDate: new Date(),
  maxDate: new Date(currentDate.setFullYear(currentDate.getFullYear() + 1))
});

const handleDateChange = (bookingInfo) => {
  bookingDate.date = bookingInfo.date;

  bookingPeople.value = bookingInfo?.people || 1;
  daysCount.value = bookingInfo.daysCount;
};
const resrvationFormRef = ref(null);

const bookingStore = useBookingStore();
const { setBookingData } = bookingStore;

const handleReservation = () => {
  const bookingInfo = {
    ...bookingDate,
    bookingPeople: bookingPeople.value,
    daysCount: daysCount.value
  };

  setBookingData({
    bookingInfo,
    roomDetail: roomDetail.value
  });

  navigateTo(`/rooms/${roomId}/booking`);
};
</script>

<template>
  <main class="mt-18 mt-md-30 bg-neutral-100">
    <section class="p-md-20 bg-primary-10">
      <div class="d-none d-md-block position-relative">
        <div class="d-flex gap-2 rounded-3xl overflow-hidden">
          <div style="width: 52.5vw">
            <img
              class="w-100"
              :src="roomDetail.imageUrl"
              alt="room-a-1"
            />
          </div>
          <div
            class="d-flex flex-wrap gap-md-2"
            style="width: 42.5vw"
          >
            <div class="d-flex gap-md-2">
              <img
                class="w-50"
                :src="roomDetail.imageUrlList[0]"
                :alt="`room-1`"
              />
              <img
                class="w-50"
                :src="roomDetail.imageUrlList[1]"
                :alt="`room-2`"
              />
            </div>
            <div class="d-flex gap-md-2">
              <img
                class="w-50"
                :src="roomDetail.imageUrlList[2]"
                :alt="`room-3`"
              />
              <img
                class="w-50"
                :src="roomDetail.imageUrlList[3]"
                :alt="`room-4`"
              />
            </div>
          </div>
        </div>
        <button
          class="position-absolute btn btn-primary-10 px-8 py-4 me-3 text-primary-100 border-primary-100 fw-bold rounded-3"
          style="bottom: 40px; right: 40px"
          type="button"
        >
          看更多
        </button>
      </div>
      <div class="d-md-none position-relative">
        <img
          class="img-fluid"
          :src="roomDetail.imageUrl"
          alt="room-a-1"
        />
        <button
          class="position-absolute btn btn-primary-10 px-8 py-4 text-primary-100 border-primary-100 fw-bold rounded-3"
          style="bottom: 23px; right: 12px"
          type="button"
        >
          看更多
        </button>
      </div>
    </section>

    <section class="py-10 py-md-30 bg-primary-10">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-7 d-flex flex-column gap-6 gap-md-20">
            <div>
              <h1 class="mb-4 text-neutral-100 fw-bold">
                {{ roomDetail.name }}
              </h1>
              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                {{ roomDetail.description }}
              </p>
            </div>

            <section>
              <h3
                class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
              >
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
                    {{ roomDetail.areaInfo }}
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
                    {{ roomDetail.bedInfo }}
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
                    {{ roomDetail.maxPeople }} 人
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
                class="d-flex flex-wrap gap-6 gap-md-10 p-6 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled"
              >
                <li
                  v-for="item in roomDetail.layoutInfo"
                  class="d-flex gap-2"
                >
                  <Icon
                    v-if="item.isProvide"
                    class="fs-5 text-primary-100"
                    name="material-symbols:check"
                  />
                  <p class="mb-0 text-neutral-80 fw-bold">{{ item.title }}</p>
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
                class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled"
              >
                <li
                  class="flex-item d-flex gap-2"
                  v-for="item in roomDetail.facilityInfo"
                >
                  <Icon
                    v-show="item.isProvide"
                    class="fs-5 text-primary-100"
                    name="material-symbols:check"
                  />
                  <p class="mb-0 text-neutral-80 fw-bold">{{ item.title }}</p>
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
                class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 bg-neutral-0 fs-8 fs-md-7 rounded-3 list-unstyled"
              >
                <li
                  v-for="item in roomDetail.amenityInfo"
                  class="flex-item d-flex gap-2"
                >
                  <Icon
                    class="fs-5 text-primary-100"
                    name="material-symbols:check"
                  />
                  <p class="mb-0 text-neutral-80 fw-bold">{{ item.title }}</p>
                </li>
              </ul>
            </section>

            <section>
              <h3
                class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
              >
                訂房須知
              </h3>
              <ol class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                <li>入住時間為下午3點，退房時間為上午12點。</li>
                <li>
                  如需延遲退房，請提前與櫃檯人員聯繫，視當日房況可能會產生額外費用。
                </li>
                <li>
                  請勿在房間內抽煙，若有抽煙需求，可以使用設在酒店各樓層的專用吸煙區。
                </li>
                <li>
                  若發現房間內的設施有損壞或遺失，將會按照價值收取賠償金。
                </li>
                <li>請愛惜我們的房間與公共空間，並保持整潔。</li>
                <li>如需額外的毛巾、盥洗用品或其他物品，請聯繫櫃檯。</li>
                <li>
                  我們提供免費的Wi-Fi，密碼可以在櫃檯或是房間內的資訊卡上找到。
                </li>
                <li>
                  請勿帶走酒店房內的物品，如有需要購買，請與我們的櫃檯人員聯繫。
                </li>
                <li>
                  我們提供24小時櫃檯服務，若有任何需求或疑問，歡迎隨時詢問。
                </li>
                <li>
                  為了確保所有客人的安全，請勿在走廊或公共區域大聲喧嘩，並遵守酒店的其他規定。
                </li>
              </ol>
            </section>
          </div>
          <div class="d-none d-md-block col-md-5">
            <VForm
              v-slot="{ errors, meta }"
              @submit="handleReservation"
            >
              <div
                class="rounded-3xl position-sticky d-flex flex-column gap-10 p-10 ms-auto bg-neutral-0"
                style="top: 160px; max-width: 478px"
              >
                <h5
                  class="pb-4 mb-0 text-neutral-100 fw-bold border-bottom border-neutral-40"
                >
                  預訂房型
                </h5>

                <div class="text-neutral-80">
                  <h2 class="fw-bold">{{ roomDetail.name }}</h2>
                  <p class="mb-0 fw-medium">
                    {{ roomDetail.description }}
                  </p>
                </div>

                <div>
                  <div class="d-flex flex-wrap gap-2 mb-4">
                    <div class="form-floating flex-grow-1 flex-shrink-1">
                      <VField
                        id="checkinInput"
                        name="checkinInput"
                        readonly
                        class="form-control p-4 pt-9 text-neutral-100 fw-medium border-neutral-100 rounded-3"
                        :class="{ 'is-invalid': errors.checkinInput }"
                        rules="required"
                        type="date"
                        v-model="bookingDate.date.start"
                        style="min-height: 74px"
                        placeholder="yyyy-mm-dd"
                        @click="openSelectDateModal"
                      />
                      <VErrorMessage
                        name="checkinInput"
                        class="invalid-feedback"
                      />

                      <label
                        class="text-neutral-80 fw-medium"
                        style="top: 8px; left: 8px"
                        for="checkinInput"
                      >
                        入住
                      </label>
                    </div>

                    <div class="form-floating flex-grow-1 flex-shrink-1">
                      <VField
                        id="checkoutInput"
                        name="checkoutInput"
                        readonly
                        class="form-control p-4 pt-9 text-neutral-100 fw-medium border-neutral-100 rounded-3"
                        :class="{ 'is-invalid': errors.checkoutInput }"
                        rules="required"
                        type="date"
                        v-model="bookingDate.date.end"
                        style="min-height: 74px"
                        placeholder="yyyy-mm-dd"
                        @click="openSelectDateModal"
                      />
                      <VErrorMessage
                        name="checkoutInput"
                        class="invalid-feedback"
                      />

                      <label
                        class="text-neutral-80 fw-medium"
                        style="top: 8px; left: 8px"
                        for="checkoutInput"
                      >
                        退房
                      </label>
                    </div>
                  </div>

                  <div
                    class="d-flex justify-content-between align-items-center text-neutral-100"
                  >
                    <p class="mb-0">人數</p>
                    <div class="d-flex align-items-center gap-4">
                      <button
                        :class="{
                          'disabled bg-neutral-40': bookingPeople === 1
                        }"
                        class="btn btn-neutral-0 p-4 border border-neutral-40 rounded-circle"
                        type="button"
                        @click="bookingPeople--"
                      >
                        <Icon
                          class="fs-5 text-neutral-100"
                          name="ic:baseline-minus"
                        />
                      </button>

                      <h6
                        id="people"
                        class="d-flex justify-content-center align-items-center fw-bold text-neutral-100"
                        style="width: 24px"
                        name="people"
                      >
                        {{ bookingPeople }}
                      </h6>

                      <button
                        :class="{
                          'disabled bg-neutral-40':
                            bookingPeople === roomDetail.maxPeople
                        }"
                        class="btn btn-neutral-0 p-4 border border-neutral-40 rounded-circle"
                        type="button"
                        @click="bookingPeople++"
                      >
                        <Icon
                          class="fs-5 text-neutral-100"
                          name="ic:baseline-plus"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <h5 class="mb-0 text-primary-100 fw-bold">
                  NT$ {{ $priceCommaFormat(roomDetail.price) }}
                </h5>
                <button
                  type="submit"
                  class="btn btn-primary-100 px-12 py-4 text-neutral-0 fw-bold rounded-3"
                  :disabled="!meta.valid"
                >
                  立即預訂
                </button>
              </div>
            </VForm>
          </div>
        </div>
      </div>

      <div
        class="d-flex d-md-none justify-content-between align-items-center position-fixed bottom-0 w-100 p-3 bg-neutral-0"
      >
        <template v-if="bookingDate.date.end === null">
          <small class="text-neutral-80 fw-medium">
            ＮＴ$ {{ $priceCommaFormat(roomDetail.price) }} / 晚
          </small>
          <button
            class="btn btn-primary-100 px-12 py-4 text-neutral-0 fw-bold rounded-3"
            type="button"
            @click="openSelectDateModal"
          >
            查看可訂日期
          </button>
        </template>

        <template v-else>
          <div class="d-flex flex-column gap-1">
            <small class="text-neutral-80 fw-medium">
              ＮＴ$ {{ $priceCommaFormat(roomDetail.price) }} /
              {{ daysCount }} 晚 / {{ bookingPeople }} 人
            </small>
            <span class="text-neutral fs-9 fw-medium text-decoration-underline">
              {{ daysFormatOnMobile(bookingDate.date?.start) }} -
              {{ daysFormatOnMobile(bookingDate.date?.end) }}
            </span>
          </div>

          <button
            type="submit"
            class="btn btn-primary-100 px-12 py-4 text-neutral-0 fw-bold rounded-3"
          >
            立即預訂
          </button>
        </template>
      </div>
    </section>
    <ClientOnly>
      <DatePickerModal
        ref="datePickerModalRef"
        :date-time="bookingDate"
        @handle-date-change="handleDateChange"
      />
    </ClientOnly>
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

.rounded-3xl {
  border-radius: 1.25rem;
}

.card-info {
  width: 97px;
  height: 97px;
}

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

.flex-item {
  // flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

input[type='date'] {
  cursor: pointer;
}
</style>
