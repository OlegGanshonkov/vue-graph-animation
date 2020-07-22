<template>
    <div class="">
        <layout-head></layout-head>

        <h1>Graph 1</h1>
        <div class="xDix">
            <h3 ref="x">2010</h3>
        </div>
        <div class="graph">
            <div :key="index" :class="'line'+(index+1)" v-for="(line, index) in lines"
                 :style="{ top: line.top + 'px' }">
                <div>{{ line.name }}</div>
            </div>
        </div>

        <div class="control">
            <button @click="animate">Play</button>
            <button @click="reload">Reload</button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueAnime from 'vue-animejs';
    import _ from 'lodash';
    import LayoutHead from "./LayoutHead";

    Vue.use(VueAnime);
    Vue.component('LayoutHead', LayoutHead);

    export default {

        name: "Graph1",
        data() {
            return {
                animation: null,
                duration: 2000,
                wrapHeight: null, // Высота парента линии
                wrapAnim: false,
                x: null, // Ось X
                xArr: [
                    2010, 2011, 2012
                ],
                maxXValue: 800,
                maxLineValue: 600,
                lines: [
                    {
                        name: 'counter',
                        key: null,
                        el: null,
                        order: null,
                        width: null,
                        top: null,
                        steps: [
                            400, 600, 450
                        ],
                        stepsValue: [],
                    },
                    {
                        name: 'terrorists',
                        key: null,
                        el: null,
                        order: null,
                        width: null,
                        top: null,
                        steps: [
                            500, 200, 300
                        ],
                        stepsValue: [],
                    },
                    {
                        name: 'immortal',
                        key: null,
                        el: null,
                        order: null,
                        width: null,
                        top: null,
                        steps: [
                            450, 500, 600
                        ],
                        stepsValue: [],
                    },
                    {
                        name: 'queen',
                        key: null,
                        el: null,
                        order: null,
                        width: null,
                        top: null,
                        steps: [
                            100, 150, 200
                        ],
                        stepsValue: [],
                    }
                ]
            };
        },
        methods: {
            wrapAnimFinished() {
                this.wrapAnim = false;
            },
            moveRow() {
                const vm = this;

                if (vm.wrapAnim === true) {
                    return false;
                }

                let linesArr = vm.lines;
                // Use Lodash to sort array by 'order'
                linesArr = _.orderBy(linesArr, ['order'], ['asc']);

                // wrap lines animation
                _.forEach(linesArr, function (value, index) {
                    let linesArr1 = _.find(vm.lines, function (o) {
                        return o.order === index;
                    });
                    let linesArr2 = _.find(vm.lines, function (o) {
                        return o.order === index + 1;
                    });

                    if (linesArr1 !== undefined && linesArr2 !== undefined) {

                        if (linesArr1.el.offsetWidth + 20 < linesArr2.el.offsetWidth) {
                            vm.wrapAnim = true;
                            linesArr1.order = linesArr1.order + 1;
                            let newTopLine1 = 10 + (linesArr1.order * vm.wrapHeight);

                            linesArr2.order = linesArr2.order - 1;
                            let newTopLine2 = 10 + (linesArr2.order * vm.wrapHeight);

                            let anime = vm.$anime.timeline()
                                .add({
                                    targets: linesArr1.el.parentElement,
                                    duration: 250,
                                    easing: 'linear',
                                    top: newTopLine1 + 'px'
                                }, 0)
                                .add({
                                    targets: linesArr2.el.parentElement,
                                    duration: 250,
                                    easing: 'linear',
                                    top: newTopLine2 + 'px'
                                }, 0);

                            anime.finished.then(vm.wrapAnimFinished);

                            return false;
                        }
                    }
                });
            },
            animate() {
                const vm = this;

                vm.animation = vm.$anime
                    .timeline({
                        autoplay: false,
                        update: function () {
                            vm.moveRow();
                        }
                    });

                // X axis animation
                _.forEach(vm.xArr, function (xArrValue, xArrIndex) {
                    let start = xArrIndex * vm.duration;
                    vm.animation
                        .add({
                            targets: vm.x,
                            duration: 100,
                            update: function () {
                                vm.x.innerHTML = xArrValue;
                            }
                        }, start);
                });

                // Lines animation
                _.forEach(vm.lines, function (value) {
                    _.forEach(value.stepsValue, function (stepValue, stepIndex) {
                        let start = stepIndex * vm.duration;
                        vm.animation
                            .add({
                                targets: value.el,
                                duration: vm.duration,
                                easing: 'linear',
                                width: stepValue
                            }, start)
                    });
                });
                vm.animation.play();
            },
            reload() {
                const vm = this;

                vm.animation.restart();
                vm.animation.pause();
            }
        },
        mounted() {
            const vm = this;

            _.forEach(vm.lines, function (value, index) {
                vm.lines[index].key = 'line' + (index+1);
                vm.lines[index].order = index;
                vm.lines[index].el = document.querySelector('.graph .line' + (index + 1) + ' div');
                if (!vm.wrapHeight) {
                    vm.wrapHeight = vm.lines[0].el.parentElement.clientHeight + 1;
                }
                vm.lines[index].top = 10 + (index * vm.wrapHeight);
                _.forEach(vm.lines[index].steps, function (stepValue, stepIndex) {
                    vm.lines[index].stepsValue[stepIndex] = Math.round(vm.maxXValue * stepValue / vm.maxLineValue);
                });
            });
            vm.x = this.$refs.x;
        },
    }
</script>

<style scoped>
    .control {
        width: 810px;
        margin: 10px auto;
    }
    .xDix {
        padding: 10px;
        width: 810px;
        margin: 20px auto;
    }
    .graph {
        position: relative;
        background: #f4f4f4;
        border: 1px solid #ccc;
        width: 810px;
        height: 300px;
        margin: 0 auto;
        padding: 10px;
    }

    /* line wrap */
    .graph > div {
        position: absolute;
        border: 1px solid #ccc;
        padding: 5px;
        margin: 0px;
        background: #fff;
    }

    /* line content */
    .graph > div > div {
        width: 50px;
        height: 50px;
        display: table-cell;
        vertical-align: middle;
    }

    .graph > div.line1 > div {
        background: red;
    }

    .graph > div.line2 > div {
        background: coral;
    }

    .graph > div.line3 > div {
        background: blue;
    }
    .graph > div.line4 > div {
        background: #42b983;
    }

    button {
        padding: 5px 10px;
        margin: 0px 5px;
        cursor: pointer;
    }
</style>

