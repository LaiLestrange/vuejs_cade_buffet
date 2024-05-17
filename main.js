const app = Vue.createApp({
  data() {
    return {
      searchText: '',
      buffets: [],
      buffet: {},

      checkAvailability_date: '',
      checkAvailability_guests: '',
      checkAvailability_event: '',
      checkedAvailability: {}
    }
  },

  computed: {
    listBuffets() {
      if (this.searchText) {
        return this.buffets.filter(buffet => {
          return buffet.brand_name
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        })
      } else {
        return this.buffets
      }
    },

    availabilityQuery() {
      query_params = new Object()
      query_params.event_id = this.checkAvailability_event
      query_params.date = this.checkAvailability_date
      query_params.guests = this.checkAvailability_guests

      query_params.query =
        '?event_id=' +
        query_params.event_id +
        '&guests=' +
        query_params.guests +
        '&date=' +
        query_params.date
      return query_params
    }
  },

  async mounted() {
    this.listBuffets = await this.getBuffets()
  },

  methods: {
    async getBuffets() {
      let response = await fetch('http://localhost:3000/api/v1/buffets')
      let buffets = await response.json()

      this.buffets = []
      this.buffet = {}

      buffets.forEach(item => {
        var buffet = new Object()
        buffet.id = item.id
        buffet.brand_name = item.brand_name
        buffet.company_name = item.company_name
        buffet.phone_number = item.phone_number
        buffet.email = item.email
        buffet.full_address = item.full_address
        buffet.zip_code = item.zip_code
        buffet.description = item.description
        this.buffets.push(buffet)
      })
    },

    async getBuffet(id) {
      this.buffets = []
      buffet_url = 'http://localhost:3000/api/v1/buffets/' + id
      let response = await fetch(buffet_url)
      response_json = await response.json()
      buffet_json = response_json.buffet
      event_types_json = response_json.event_types

      let buffet = new Object()
      buffet.id = buffet_json.id
      buffet.company_name = buffet_json.company_name
      buffet.phone_number = buffet_json.phone_number
      buffet.email = buffet_json.email
      buffet.full_address = buffet_json.full_address
      buffet.zip_code = buffet_json.zip_code
      buffet.description = buffet_json.description
      buffet.event_types = new Array()

      event_types_json.forEach(item => {
        event_type = new Object()
        event_type.id = item.id
        event_type.name = item.name
        event_type.description = item.description
        event_type.menu = item.menu
        event_type.location = item.location
        event_type.min_guests = item.min_guests
        event_type.max_guests = item.max_guests
        event_type.duration = item.duration
        buffet.event_types.push(event_type)
      })
      this.buffet = buffet
    },

    async checkAvailability() {
      query = this.availabilityQuery.query
      console.log(query)
      let response = await fetch(
        'http://localhost:3000/api/v1/availability/' + query,
        {
          method: 'POST'
        }
      )
      response_json = await response.json()
      this.checkedAvailability.available = response_json.available
      this.checkedAvailability.availability = response_json.availability

      if (this.checkedAvailability.available) {
        this.checkedAvailability.base_price = response_json.base_price
      } else {
        this.checkedAvailability.base_price = 0
      }

      console.log(this.checkedAvailability)
    }
  }
})

app.mount('#app')
