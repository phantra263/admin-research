import moment from 'moment'

export const formatDate = function (date, format) {
    if (date) {
        return moment(String(date)).format(format)
    }
}
