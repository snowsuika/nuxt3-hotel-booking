<script setup>
definePageMeta({
  layout: 'user'
});

const { orderList, getOrderList, deleteOrder } = useOrder();
const { $priceCommaFormat } = useNuxtApp();
const { $swal } = useNuxtApp();

import { weekDateFormate } from '@/utils/date.js';
import { getDaysCount } from '@/utils/daysCount.js';

await getOrderList();

const latestOrder = computed(() => {
  return orderList.value[orderList.value.length - 1];
});

const historyOrders = computed(() => {
  return orderList.value
    .slice(0, orderList.value.length - 1)
    .slice(-3)
    .reverse();
});

const daysCount = computed(() => {
  const { checkInDate, checkOutDate } = latestOrder.value;
  return getDaysCount(checkInDate, checkOutDate);
});

/**
 * 取消訂單
 */
const { $modal } = useNuxtApp();
const cancelModalRef = ref(null);
let cancelModal;

onMounted(() => {
  cancelModal = $modal(cancelModalRef.value, {});
});

const openCancelModal = () => {
  cancelModal.show();
};

const handleCancelOrder = async () => {
  try {
    const res = await deleteOrder(latestOrder.value._id);

    if (res.status) {
      $swal.fire({
        position: 'center',
        icon: 'success',
        title: '取消成功',
        timer: 3000,
        showConfirmButton: false
      });
    }
  } catch (error) {
    alert(error);
  } finally {
    cancelModal.hide();
  }
};
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-7">
      <div
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
        style="max-width: 730px"
      >
        <div>
          <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">
            預訂參考編號： {{ latestOrder._id }}
          </p>
          <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
            即將來的行程
          </h2>
        </div>

        <img
          class="img-fluid rounded-3"
          :src="latestOrder.roomId.imageUrl"
          :alt="latestOrder.roomId.name"
        />

        <section class="d-flex flex-column gap-6">
          <h3
            class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
          >
            <p class="mb-0">
              {{ latestOrder.roomId.name }}，{{ daysCount }} 晚
            </p>
            <span
              class="d-inline-block mx-4 bg-neutral-80"
              style="width: 1px; height: 18px"
            />
            <p class="mb-0">住宿人數：2 位</p>
          </h3>

          <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
            <p class="title-deco mb-2">
              入住：{{ weekDateFormate(latestOrder.checkInDate) }}，15:00 可入住
            </p>
            <p class="title-deco mb-0">
              退房：{{ weekDateFormate(latestOrder.checkInDate) }}，12:00 前退房
            </p>
          </div>

          <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
            NT$ {{ $priceCommaFormat(latestOrder.roomId.price) }}
          </p>
        </section>

        <hr class="my-0 opacity-100 text-neutral-40" />

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            房內設備
          </h3>
          <ul
            class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
          >
            <li
              v-for="item in latestOrder.roomId.facilityInfo"
              :key="item.title"
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
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            備品提供
          </h3>
          <ul
            class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
          >
            <li
              v-for="item in latestOrder.roomId.amenityInfo"
              :key="item.title"
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

        <div class="d-flex gap-4">
          <button
            data-bs-toggle="modal"
            data-bs-target="#cancelModal"
            class="btn btn-outline-primary-100 w-50 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
            @click="openCancelModal"
          >
            取消預訂
          </button>
          <NuxtLink
            :to="`/rooms/${latestOrder.roomId._id}`"
            class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
            type="button"
          >
            查看詳情
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-5">
      <div
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
      >
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">歷史訂單</h2>
        <template
          v-for="(order, index) in historyOrders"
          :key="order._id"
        >
          <div class="d-flex flex-column flex-lg-row gap-6">
            <img
              class="img-fluid object-fit-cover rounded-3"
              style="max-width: 120px; height: 80px"
              :src="order.roomId.imageUrl"
              :alt="order.roomId.name"
            />
            <section class="d-flex flex-column gap-4">
              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                預訂參考編號： {{ order._id }}
              </p>

              <h3
                class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
              >
                {{ order.roomId.name }}
              </h3>

              <div class="text-neutral-80 fw-medium">
                <p class="mb-2">
                  住宿天數：
                  {{ getDaysCount(order.checkInDate, order.checkOutDate) }} 晚
                </p>
                <p class="mb-0">住宿人數：{{ order.peopleNum }} 位</p>
              </div>

              <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                <p class="title-deco mb-2">
                  入住：{{ weekDateFormate(order.checkInDate) }}，15:00 可入住
                </p>
                <p class="title-deco mb-0">
                  退房：{{ weekDateFormate(order.checkOutDate) }}，12:00 前退房
                </p>
              </div>
              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
                NT$ {{ $priceCommaFormat(order.roomId.price) }}
              </p>
            </section>
          </div>

          <hr
            v-if="index !== historyOrders.length - 1"
            class="my-0 opacity-100 text-neutral-40"
          />
        </template>

        <button
          class="btn btn-outline-primary-100 py-4 fw-bold"
          style="--bs-btn-hover-color: #fff"
          type="button"
        >
          查看更多
        </button>
      </div>
    </div>
  </div>

  <div
    id="cancelModal"
    ref="cancelModalRef"
    class="modal fade"
    tabindex="-1"
  >
    <div
      class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100"
    >
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div
          class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold"
        >
          確定要取消此房型的預訂嗎？
        </div>
        <div class="modal-footer d-flex gap-4">
          <button
            type="button"
            class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            data-bs-dismiss="modal"
          >
            關閉視窗
          </button>
          <button
            type="button"
            class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold"
            @click="handleCancelOrder"
          >
            確定取消
          </button>
        </div>
      </div>
    </div>
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

.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #bf9d7d;
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}

.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>
