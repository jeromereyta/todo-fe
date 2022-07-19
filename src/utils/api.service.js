import AxiosInstance from "@/service/AxiosInstance";

const ApiService = {
  query(resource, params) {
    return AxiosInstance.get(resource, params).catch(error => {
      throw new Error(`[ENCO] ApiService ${error}`);
    });
  },

  get(resource, slug = "") {
    return AxiosInstance.get(`${resource}/${slug}`).catch(error => {
      throw new Error(`[ENCO] ApiService ${error}`);
    });
  },

  async post(resource, params) {
    return AxiosInstance.post(`${resource}`, params)
  },

  async update(resource, slug, params) {
    return AxiosInstance.post(`${resource}/${slug}`, params);
  },

  put(resource, params) {
    return AxiosInstance.put(`${resource}`, params);
  },

  async delete(resource, slug) {
    return AxiosInstance.delete(`${resource}/${slug}`).catch(error => {
      throw new Error(`[ENCO] ApiService ${error}`);
    });
  }
};

export default ApiService;

export const CustomersService = {
  get() {
    return ApiService.get("sales/customers");
  },
  find(slug) {
    return ApiService.get("sales/customer", slug)
  },
  update(slug, param) {
    return ApiService.update("sales/customer/update", slug, param)
  },
  post(payload) {
    return ApiService.post("sales/customer/create", payload);
  },
  async destroy(slug) {
    await ApiService.delete("sales/customer/delete", slug)
  }
};
