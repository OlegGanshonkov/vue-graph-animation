<template>
    <div class="header">
        <ul class="top_menu">
            <li :key="index" :class="'item li-' + index" v-for="(item, index) in menu">
                <a :href="item.url" >
                    {{ item.name }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "LayoutHead",
        data() {
            return {
                menu: [
                    {
                        'url': '/graph1',
                        'name': 'graph1'
                    },
                    {
                        'url': '/graph2',
                        'name': 'graph2'
                    },
                ],
            }
        },
        methods: {
        },
        computed: {

        },
        mounted() {

        }
    }
</script>

<style>
    .top_menu {
        overflow: hidden;
        margin: 0px;
        padding: 0px;
    }
    .top_menu li {
        list-style-type: none;
        float: left;
        padding: 4px 8px;
        background: #cccccc;
        border:1px solid #fff;
        border-radius: 4px;
    }
    .top_menu li a {
        text-decoration: none;
        color: black;
    }
</style>