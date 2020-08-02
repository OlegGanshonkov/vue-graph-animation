<template>
    <div class="container">
        <div class="overlay"></div>
        <div class="overlay2"></div>

        <h1>starcraft 2 <span>10 years</span></h1>

        <div class="winners">
            <div v-show="winner.visible" :key="index" class="winner" v-for="(winner, index) in winners">
                <img :src="require(`@/assets/static/${winner.img}`)" width="79" height="60"/>
                <span>{{winner.name}}</span>
            </div>

        </div>
        <div class="xDix">
            <h3 ref="x"></h3>
        </div>
        <table class="main">
            <tr class="top">
                <td class="left">
                    <div></div>
                </td>
                <td class="center">
                    <div></div>
                    <span></span></td>
                <td class="right">
                    <div></div>
                </td>
            </tr>
            <tr class="content">
                <td class="left"></td>
                <td class="center">
                    <div class="graph">
                        <div :key="index" :class="'line'+(index+1)" v-for="(line, index) in lines"
                             :style="{ top: line.top + 'px' }">
                            <div><img class="icon" v-if="line.img" :src="require(`@/assets/static/${line.img}`)"
                                      width="79" height="60"/>{{ line.name }}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="right"></td>
            </tr>
            <tr class="bottom">
                <td class="left"></td>
                <td class="center"></td>
                <td class="right"></td>
            </tr>
        </table>
        <div class="xInfo">Participants</div>


        <div v-if="!hideControl" class="control">
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
                stepsCount: 0,
                hideControl: false,
                animation: null,
                duration: 2000,
                wrapHeight: null, // Высота парента линии
                wrapAnim: false,
                x: null, // Ось X
                xArr: [
                    '2012 <span>StarCraft II World Championship Series: Global Finals</span>',
                    '2013 <span>StarCraft II World Championship Series: Global Finals</span>',
                    '2014 <span>StarCraft II World Championship Series: Global Finals</span>',
                ],
                maxXValue: 800,
                maxLineValue: 600,
                winners: [
                    {
                        img: 'protos.png',
                        name: 'Stats',
                        visible:false
                    },
                    {
                        img: 'zerg.png',
                        name: 'Bly',
                        visible:false
                    },
                    {
                        img: 'protos.png',
                        name: 'Stats',
                        visible:false
                    },
                ],
                lines: [
                    {
                        name: 'protoss',
                        img: 'protos.png',
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
                        name: 'zerg',
                        img: 'zerg.png',
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
                        name: 'terran',
                        img: 'terran.png',
                        key: null,
                        el: null,
                        order: null,
                        width: null,
                        top: null,
                        steps: [
                            450, 500, 600
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
                            },
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
                                width: stepValue,
                                complete: function() {
                                    vm.stepsCount++;
                                    if (vm.stepsCount === 3){
                                        vm.winners[0].visible = true;
                                    } else if (vm.stepsCount === 6){
                                        vm.winners[1].visible = true;
                                    } else if (vm.stepsCount === 9){
                                        vm.winners[2].visible = true;
                                    }
                                }
                            }, start)
                    });
                });
                vm.animation.play();
                vm.hideControl = true;
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
                vm.lines[index].key = 'line' + (index + 1);
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

<style>
    @font-face {
        font-family: 'Conv_starcraft';
        src: url('~@/assets/fonts/starcraft.eot');
        src: local('☺'),
        url('~@/assets/fonts/starcraft.woff') format('woff'),
        url('~@/assets/fonts/starcraft.ttf') format('truetype'),
        url('~@/assets/fonts/starcraft.svg') format('svg');
        font-weight: normal;
        font-style: normal;
    }

    * {
        box-sizing: border-box;
    }

    html, body {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        background: #ccc url('~@/assets/bg.jpg') center;
        background-size: cover;
        overflow: hidden;
        font-family: 'Conv_starcraft';
    }

    .container {
        height: 100%;
    }
    .xDix span {
        color: #cccccc;
        font-size: 14px;
    }
    .xInfo {
        color: #cccccc;
        width: 800px;
        margin:0 auto;
        padding-top: 10px;
        font-size: 12px;
    }
</style>
<style scoped>
    .winners {
        padding: 35px 10px 10px 10px;
    }
    .winner {
        float: left;
        margin-right: 20px;
    }

    .winner img, .winner span {
        display: block;
    }

    .winner span {
        margin-left: 20px;
        color: #fff;
        font-size: 12px;
    }

    h1 {
        color: #fff;
        padding: 20px 40px;
    }

    h1 span {
        position: absolute;
        text-align: center;
        display: inline-block;
        left: 50%;
        margin-left: -180px;
        font-size: 60px;
    }

    .overlay {
        top: 120px;
        position: absolute;
        width: 100%;
        height: 150px;
        background: rgba(0, 0, 0, 0.3);
    }

    .overlay2 {
        top: 330px;
        position: absolute;
        width: 100%;
        height: 420px;
        background: rgba(0, 0, 0, 0.3);
    }

    .main {
        table-layout: fixed;
        position: relative;
        border-collapse: collapse;
        margin: 0 auto;
    }

    .main .left, .main .right {
        width: 5px;
    }

    .main .top {
        height: 16px;
    }

    .main .content .left {
        background: #ccc url('~@/assets/borderLeft.png') center repeat-y;
    }

    .main .content .right {
        background: #ccc url('~@/assets/borderRight.png') center repeat-y;
    }

    .main .top .right, .main .top .left {
        position: relative;
    }

    .main .top .right div {
        position: absolute;
        z-index: 2;
        top: 0px;
        left: -11px;
        width: 16px;
        height: 20px;
        background: transparent url('~@/assets/cornerTopRight.png') center;
        opacity: 0.7;
    }

    .main .top .left div {
        position: absolute;
        z-index: 2;
        top: 0px;
        left: 0px;
        width: 16px;
        height: 20px;
        background: transparent url('~@/assets/cornerTopLeft.png') center;
        opacity: 0.9;
    }

    .main .top .center div {
        position: absolute;
        width: 97%;
        top: 0px;
        left: 15px;
        z-index: 2;
        height: 20px;
        background: transparent url('~@/assets/topCenter.png') center repeat-x;
    }

    .main .top .center span {
        display: block;
        position: absolute;
        width: 99%;
        top: 6px;
        left: 5px;
        z-index: 2;
        height: 10px;
        background: rgba(0, 118, 231, 0.3);
    }

    .main .bottom .center {
        z-index: 2;
        height: 1px;
        background: transparent url('~@/assets/bottomCenter.png') center repeat-x;
    }

    .main .bottom .right {
        background: transparent url('~@/assets/bottomCenter.png') center repeat-x;
    }

    .main .bottom .left {
        background: transparent url('~@/assets/bottomCenter.png') center repeat-x;
    }

    .main .content .center {
        background: rgba(0, 118, 231, 0.3);
    }

    .control {
        position: relative;
        z-index: 8;
        width: 810px;
        margin: 10px auto;
        background-size: cover;
    }

    .xDix {
        padding: 10px;
        width: 810px;
        margin: 160px auto 20px auto;
    }

    .xDix h3 {
        color: #fff;
        text-align: center;
    }

    .xDix span {
        color: #cccccc;
        font-size: 14px;
    }

    .graph {
        position: relative;
        width: 810px;
        height: 210px;
        margin: 0 auto;
        padding: 10px;
    }

    /* line wrap */
    .graph > div {
        position: absolute;
        padding: 5px;
        margin: 0px;
        background: transparent url('~@/assets/static/bgLineBlue.png') left center repeat-x;
        background-size: 5px 30px;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
    }

    .graph > div.line3 {
        background: transparent url('~@/assets/static/bgLineRed.png') left center repeat-x;
        background-size: 5px 30px;
    }

    .graph > div.line2 {
        background: transparent url('~@/assets/static/bgLineZerg.png') left center repeat-x;
        background-size: 5px 30px;
    }

    /* line content */
    .graph > div > div {
        width: 50px;
        height: 50px;
        display: table-cell;
        vertical-align: middle;
    }

    .graph > div.line1 > div {
        background: transparent;
    }

    .graph > div.line2 > div {
        background: transparent;
    }

    .graph > div.line3 > div {
        background: transparent;
    }

    .graph > div.line4 > div {
        background: #42b983;
    }

    button {
        padding: 5px 10px;
        margin: 0px 5px;
        cursor: pointer;
    }

    .graph .icon {
        position: absolute;
        left: -100px;
        margin-top: -20px;
    }

    /*
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

    // line wrap
    .graph > div {
        position: absolute;
        border: 1px solid #ccc;
        padding: 5px;
        margin: 0px;
        background: #fff;
    }

    // line content
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
    */
</style>

